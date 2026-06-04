export declare class AnalyticsService {
    getStudentAnalytics(tenantId: string): Promise<{
        totalStudents: number;
        activeStudents: number;
        enrollmentsByMonth: {
            month: string;
            count: number;
        }[];
        averageProgress: number;
        completionRate: {
            total: number;
            completed: number;
            rate: number;
        };
        attendanceSummary: {
            status: import(".prisma/client").$Enums.AttendanceStatus;
            count: number;
        }[];
        topStudents: {
            user: {
                email: string;
                fullName: string;
            };
            course: {
                title: string;
            };
            progress: number;
        }[];
        atRiskStudents: {
            user: {
                email: string;
                fullName: string;
            };
            course: {
                title: string;
            };
            progress: number;
            daysSinceEnrolled: number;
        }[];
    }>;
    getStudentProfile(tenantId: string, studentUserId: string): Promise<{
        enrollments: {
            course: {
                status: import(".prisma/client").$Enums.CourseStatus;
                title: string;
            };
            progress: number;
            completedAt: Date;
            enrolledAt: Date;
        }[];
        assessmentSummary: {
            total: number;
            graded: number;
            averageScore: number;
        };
        certificatesEarned: number;
        attendanceSummary: {
            status: import(".prisma/client").$Enums.AttendanceStatus;
            count: number;
        }[];
    }>;
    getCourseAnalytics(tenantId: string): Promise<{
        totalCourses: number;
        coursesByStatus: {
            status: import(".prisma/client").$Enums.CourseStatus;
            count: number;
        }[];
        topEnrolledCourses: {
            course: {
                id: string;
                title: string;
                thumbnailUrl: string;
                instructor: {
                    fullName: string;
                };
            };
            enrollments: number;
        }[];
        completionRatePerCourse: {
            courseId: string;
            title: string;
            total: number;
            completed: number;
            rate: number;
        }[];
        avgAssessmentScorePerCourse: {
            courseId: string;
            title: string;
            avgScore: number;
        }[];
        instructorPerformance: {
            totalEnrollments: number;
            certificatesIssued: number;
            instructorId: string;
            fullName: string;
        }[];
    }>;
    getSingleCourseAnalytics(tenantId: string, courseId: string): Promise<{
        course: {
            enrollmentCount: number;
            assessmentCount: number;
            certificatesIssued: number;
            _count: {
                certificates: number;
                enrollments: number;
                assessments: number;
            };
            instructor: {
                fullName: string;
            };
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.CourseStatus;
            deletedAt: Date | null;
            instructorId: string;
            title: string;
            description: string;
            thumbnailUrl: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            categoryId: string | null;
            version: number;
        };
        enrollmentOverTime: {
            week: string;
            count: number;
        }[];
        progressDistribution: {
            bucket: string;
            count: number;
        }[];
        assessmentStats: {
            totalSubmissions: number;
            averageScore: number;
            minScore: number;
            maxScore: number;
        };
    }>;
    getRevenueAnalytics(tenantId: string): Promise<{
        summary: {
            totalRevenue: number;
            totalTransactions: number;
            revenueThisMonth: number;
            revenueLastMonth: number;
            monthOverMonthGrowth: number;
        };
        revenueByMonth: {
            month: string;
            revenue: number;
            transactions: number;
        }[];
        revenueByGateway: {
            gateway: string;
            revenue: number;
            count: number;
        }[];
        revenueByStatus: {
            status: import(".prisma/client").$Enums.PaymentStatus;
            amount: number;
            count: number;
        }[];
        topRevenueCourses: {
            courseId: string;
            title: string;
            revenue: number;
            sales: number;
        }[];
    }>;
    getInstitutionAnalytics(tenantId: string): Promise<{
        overview: {
            users: number;
            courses: number;
            enrollments: number;
            certificates: number;
            submissions: number;
            exams: number;
            notifications: number;
        };
        departmentBreakdown: {
            id: string;
            name: string;
            code: string;
        }[];
        sessionActivity: {
            name: string;
            startDate: Date;
            endDate: Date;
            isActive: boolean;
        }[];
        certificatesThisMonth: number;
        examAttemptStats: {
            total: number;
            averageScore: number;
        };
        notificationStats: {
            channel: import(".prisma/client").$Enums.NotificationChannel;
            count: number;
        }[];
        monthlyActiveUsers: number;
        subscriptionStatus: {
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            planName: string;
            currentPeriodEnd: Date;
        };
    }>;
    getDashboardSummary(tenantId: string): Promise<{
        totalStudents: number;
        totalRevenue: number;
        activeCourses: number;
        certificatesIssued: number;
    }>;
}
