<?php

namespace App\Http\Controllers;

use App\Models\Challenge;
use App\Models\ChallengeVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ChallengeVariantController extends Controller
{
    public function index(Challenge $challenge)
    {
        $variants = $challenge->variants()->latest()->get();

        return Inertia::render('Challenges/Variants/Index', [
            'challenge' => $challenge,
            'variants' => $variants
        ]);
    }

    public function create(Challenge $challenge)
    {
        return Inertia::render('Challenges/Variants/Create', [
            'challenge' => $challenge
        ]);
    }

    public function store(Request $request, Challenge $challenge)
    {
        if ($challenge->requires_review && $challenge->variants()->exists()) {
            return back()->with('error', 'Review challenges can only have one variant.');
        }

        $validated = $request->validate([
            'data' => 'required|file|mimes:pdf|max:10240',
            'solution' => $challenge->requires_review ? 'nullable|string' : 'required|string',
        ]);

        // Store PDF file
        $pdfPath = $request->file('data')->store('variants', 'private');

        $challenge->variants()->create([
            'data' => $pdfPath,
            'solution' => $validated['solution'],
        ]);

        return redirect()
            ->route('challenges.variants.index', $challenge)
            ->with('success', 'Variant created successfully!');
    }

    public function edit(Challenge $challenge, ChallengeVariant $variant)
    {
        return Inertia::render('Challenges/Variants/Edit', [
            'challenge' => $challenge,
            'variant' => $variant,
        ]);
    }

    public function update(Request $request, Challenge $challenge, ChallengeVariant $variant)
    {
        $validated = $request->validate([
            'data' => 'nullable|file|mimes:pdf|max:10240', // 10MB max
            'solution' => 'required|string',
        ]);

        $data = ['solution' => $validated['solution']];

        if ($request->hasFile('data')) {
            // Delete old PDF if exists
            if ($variant->data) {
                Storage::disk('private')->delete($variant->data);
            }
            // Store new PDF
            $data['data'] = $request->file('data')->store('variants', 'private');
        }

        $variant->update($data);

        return redirect()
            ->route('challenges.variants.index', $challenge)
            ->with('success', 'Variant updated successfully!');
    }

    public function destroy(Challenge $challenge, ChallengeVariant $variant)
    {
        // Delete PDF file
        if ($variant->data) {
            Storage::disk('private')->delete($variant->data);
        }

        $variant->delete();

        return redirect()
            ->route('challenges.variants.index', $challenge)
            ->with('success', 'Variant deleted successfully!');
    }

    public function download(Challenge $challenge, ChallengeVariant $variant)
    {
        // Check if file exists
        if (!Storage::disk('private')->exists($variant->data)) {
            abort(404);
        }

        return Storage::disk('private')->download(
            $variant->data,
            "variant_{$variant->id}.pdf"
        );
    }
}
