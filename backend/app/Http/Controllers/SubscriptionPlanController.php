<?php

namespace App\Http\Controllers;

use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;

class SubscriptionPlanController extends Controller
{
    public function index()
    {
        return response()->json(SubscriptionPlan::where('is_active', true)->get());
    }

    public function store(Request $request)
    {
        // Only Super Admin can manage plans
        if ($request->user()->role?->name !== 'SUPER_ADMIN') {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'monthly_price' => 'required|numeric',
            'annual_price' => 'required|numeric',
            'max_students' => 'nullable|integer',
            'max_staff' => 'nullable|integer',
            'storage_limit' => 'nullable|integer',
            'feature_access' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $plan = SubscriptionPlan::create($request->all());

        return response()->json($plan, 201);
    }

    public function update(Request $request, $id)
    {
        if ($request->user()->role?->name !== 'SUPER_ADMIN') {
            abort(403, 'Unauthorized action.');
        }

        $plan = SubscriptionPlan::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'monthly_price' => 'sometimes|required|numeric',
            'annual_price' => 'sometimes|required|numeric',
            'max_students' => 'nullable|integer',
            'max_staff' => 'nullable|integer',
            'storage_limit' => 'nullable|integer',
            'feature_access' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $plan->update($request->all());

        return response()->json($plan);
    }

    public function show($id)
    {
        return response()->json(SubscriptionPlan::findOrFail($id));
    }
}
