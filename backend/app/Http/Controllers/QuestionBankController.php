<?php
namespace App\Http\Controllers;

use App\Models\QuestionCategory;
use App\Models\Question;
use Illuminate\Http\Request;

class QuestionBankController extends Controller
{
    // --- Categories ---
    public function indexCategories(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $categories = QuestionCategory::where('tenant_id', $tenantId)->get();
        return response()->json($categories);
    }

    public function storeCategory(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category = QuestionCategory::create([
            'tenant_id' => $request->user()->tenant_id,
            'name' => $request->input('name'),
        ]);

        return response()->json($category, 201);
    }

    public function destroyCategory(Request $request, $id)
    {
        $tenantId = $request->user()->tenant_id;
        $category = QuestionCategory::where('tenant_id', $tenantId)->findOrFail($id);
        $category->delete();
        return response()->json(['message' => 'Category deleted']);
    }

    // --- Questions ---
    public function indexQuestions(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $query = Question::where('tenant_id', $tenantId)->with('category');

        if ($request->has('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        return response()->json($query->get());
    }

    public function storeQuestion(Request $request)
    {
        $request->validate([
            'category_id' => 'nullable|uuid|exists:question_categories,id',
            'type' => 'required|in:multiple_choice,essay,true_false',
            'text' => 'required|string',
            'options_json' => 'nullable|array',
            'answer_json' => 'nullable|array',
        ]);

        $question = Question::create([
            'tenant_id' => $request->user()->tenant_id,
            'category_id' => $request->input('category_id'),
            'type' => $request->input('type'),
            'text' => $request->input('text'),
            'options_json' => $request->input('options_json'),
            'answer_json' => $request->input('answer_json'),
        ]);

        return response()->json($question->load('category'), 201);
    }

    public function updateQuestion(Request $request, $id)
    {
        $tenantId = $request->user()->tenant_id;
        $question = Question::where('tenant_id', $tenantId)->findOrFail($id);

        $request->validate([
            'category_id' => 'nullable|uuid|exists:question_categories,id',
            'type' => 'sometimes|in:multiple_choice,essay,true_false',
            'text' => 'sometimes|string',
            'options_json' => 'nullable|array',
            'answer_json' => 'nullable|array',
        ]);

        $question->update($request->only(['category_id', 'type', 'text', 'options_json', 'answer_json']));

        return response()->json($question->load('category'));
    }

    public function destroyQuestion(Request $request, $id)
    {
        $tenantId = $request->user()->tenant_id;
        $question = Question::where('tenant_id', $tenantId)->findOrFail($id);
        $question->delete();
        return response()->json(['message' => 'Question deleted']);
    }
}
