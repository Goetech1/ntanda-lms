import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaClient, AiFeature } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI | null = null;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
      this.logger.log('OpenAI initialized successfully.');
    } else {
      this.logger.warn('OPENAI_API_KEY not found in environment. AI Module is running in MOCK mode.');
    }
  }

  // ─── 1. AI Tutor ─────────────────────────────────────────────────────────────
  
  async askTutor(tenantId: string, userId: string, question: string, courseId?: string) {
    let systemPrompt = 'You are an expert, helpful, and concise AI tutor for an educational platform.';
    let contextData = '';

    if (courseId) {
      const course = await prisma.course.findUnique({
        where: { id: courseId, tenantId },
        select: { title: true, description: true },
      });
      if (course) {
        systemPrompt += ` The student is currently studying a course titled "${course.title}". Base your answers primarily around this subject context.`;
        contextData = `Course Description: ${course.description}\n`;
      }
    }

    const fullPrompt = `${contextData}Student Question: ${question}`;

    if (!this.openai) {
      return this.mockResponse(tenantId, userId, AiFeature.TUTOR, fullPrompt, "This is a mock AI Tutor response. Please configure OPENAI_API_KEY.", courseId);
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: fullPrompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const answer = response.choices[0].message.content || 'I could not generate an answer at this time.';
      const tokensUsed = response.usage?.total_tokens || 0;

      await this.logInteraction(tenantId, userId, AiFeature.TUTOR, fullPrompt, answer, tokensUsed, courseId);
      
      return { answer, tokensUsed };
    } catch (error: any) {
      this.logger.error(`AI Tutor error: ${error.message}`);
      throw new BadRequestException('AI Tutor is currently unavailable.');
    }
  }

  // ─── 2. AI Quiz Generator ────────────────────────────────────────────────────

  async generateQuiz(tenantId: string, userId: string, topic: string, questionCount: number = 5, difficulty: string = 'intermediate') {
    const systemPrompt = `You are an expert curriculum designer. Generate exactly ${questionCount} multiple-choice questions about the topic provided. Difficulty level: ${difficulty}. 
    Respond ONLY with a valid JSON array of objects. Do not wrap in markdown tags like \`\`\`json. Each object must exactly match this format:
    { "text": "The question text", "type": "MCQ", "points": 10, "options": [ { "text": "Option 1", "isCorrect": true }, { "text": "Option 2", "isCorrect": false } ] }`;

    const fullPrompt = `Topic: ${topic}`;

    if (!this.openai) {
      const mockQuiz = Array(questionCount).fill(0).map((_, i) => ({
        text: `Mock Question ${i + 1} about ${topic}`,
        type: 'MCQ',
        points: 10,
        options: [
          { text: 'Correct Answer', isCorrect: true },
          { text: 'Wrong Answer', isCorrect: false },
        ]
      }));
      return this.mockResponse(tenantId, userId, AiFeature.QUIZ_GENERATOR, fullPrompt, JSON.stringify(mockQuiz), undefined, mockQuiz);
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: fullPrompt },
        ],
        temperature: 0.5,
      });

      const content = response.choices[0].message.content?.trim() || '[]';
      const tokensUsed = response.usage?.total_tokens || 0;

      let parsedQuestions = [];
      try {
        parsedQuestions = JSON.parse(content);
      } catch (parseError) {
        this.logger.error(`Failed to parse AI Quiz JSON: ${content}`);
        throw new BadRequestException('AI returned an invalid quiz format. Please try again.');
      }

      await this.logInteraction(tenantId, userId, AiFeature.QUIZ_GENERATOR, fullPrompt, content, tokensUsed);

      return { questions: parsedQuestions, tokensUsed };
    } catch (error: any) {
      this.logger.error(`AI Quiz generation error: ${error.message}`);
      throw new BadRequestException('AI Quiz generation is currently unavailable.');
    }
  }

  // ─── 3. Learning Recommendations ─────────────────────────────────────────────

  async getRecommendations(tenantId: string, userId: string) {
    // Gather student context
    const enrollments = await prisma.enrollment.findMany({
      where: { tenantId, userId },
      include: { course: { select: { title: true, category: { select: { name: true } } } } }
    });

    const completedCourses = enrollments.filter(e => e.progressPercentage === 100).map(e => e.course?.title).filter(Boolean);
    const inProgressCourses = enrollments.filter(e => e.progressPercentage < 100).map(e => e.course?.title).filter(Boolean);
    const interests = [...new Set(enrollments.map(e => e.course?.category?.name).filter(Boolean))];

    // Fetch available courses not enrolled
    const enrolledIds = enrollments.map(e => e.courseId);
    const availableCourses = await prisma.course.findMany({
      where: { tenantId, status: 'PUBLISHED', id: { notIn: enrolledIds } },
      select: { id: true, title: true, description: true, category: { select: { name: true } } }
    });

    if (availableCourses.length === 0) {
      return { recommendations: [], message: "No new courses available to recommend." };
    }

    const systemPrompt = `You are an AI academic advisor. Review the student's profile and the catalog of available courses. 
    Select the top 3 best courses for this student to take next.
    Respond ONLY with a valid JSON array of strings containing the exact IDs of the recommended courses. Do not wrap in markdown tags. Example: ["uuid-1", "uuid-2"]`;

    const userPrompt = `
      Student Profile:
      - Completed Courses: ${completedCourses.length > 0 ? completedCourses.join(', ') : 'None'}
      - In Progress Courses: ${inProgressCourses.length > 0 ? inProgressCourses.join(', ') : 'None'}
      - Known Interests: ${interests.length > 0 ? interests.join(', ') : 'None'}
      
      Available Course Catalog:
      ${availableCourses.map(c => `ID: ${c.id} | Title: ${c.title} | Category: ${c.category?.name || 'None'}`).join('\n')}
    `;

    if (!this.openai) {
      const mockRecommendations = availableCourses.slice(0, Math.min(3, availableCourses.length));
      return this.mockResponse(tenantId, userId, AiFeature.RECOMMENDATION, userPrompt, JSON.stringify(mockRecommendations.map(c => c.id)), undefined, mockRecommendations);
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
      });

      const content = response.choices[0].message.content?.trim() || '[]';
      const tokensUsed = response.usage?.total_tokens || 0;

      let recommendedIds: string[] = [];
      try {
        recommendedIds = JSON.parse(content);
      } catch (e) {
         this.logger.error(`Failed to parse AI Recommendations JSON: ${content}`);
         recommendedIds = [];
      }

      await this.logInteraction(tenantId, userId, AiFeature.RECOMMENDATION, 'Requested recommendations based on profile', content, tokensUsed);

      const recommendedCourses = availableCourses.filter(c => recommendedIds.includes(c.id));
      return { recommendations: recommendedCourses, tokensUsed };

    } catch (error: any) {
      this.logger.error(`AI Recommendation error: ${error.message}`);
      throw new BadRequestException('AI Recommendations are currently unavailable.');
    }
  }

  // ─── Auditing & Tracking ─────────────────────────────────────────────────────

  private async logInteraction(tenantId: string, userId: string, feature: AiFeature, prompt: string, response: string, tokensUsed: number, contextId?: string) {
    await prisma.aiInteraction.create({
      data: {
        tenantId,
        userId,
        feature,
        prompt,
        response,
        tokensUsed,
        contextId,
      }
    });

    // Also log to the general system audit log for security tracing
    await prisma.auditLog.create({
      data: {
        tenantId,
        userId,
        action: `AI_EXECUTE_${feature}`,
        entityType: 'AI_INTERACTION',
        entityId: 'SYSTEM',
        ipAddress: 'API_INTERNAL',
      }
    });
  }

  private async mockResponse(tenantId: string, userId: string, feature: AiFeature, prompt: string, mockResponseString: string, contextId?: string, parsedPayload?: any) {
    await this.logInteraction(tenantId, userId, feature, prompt, mockResponseString, 0, contextId);
    if (feature === AiFeature.TUTOR) return { answer: mockResponseString, tokensUsed: 0 };
    if (feature === AiFeature.QUIZ_GENERATOR) return { questions: parsedPayload, tokensUsed: 0 };
    if (feature === AiFeature.RECOMMENDATION) return { recommendations: parsedPayload, tokensUsed: 0 };
    return { result: mockResponseString, tokensUsed: 0 };
  }
}
