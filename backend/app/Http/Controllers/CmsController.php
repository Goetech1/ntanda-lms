<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;

class CmsController extends Controller
{
    public function getPages(Request $request) { return response()->json(['pages' => []]); }
    public function savePage(Request $request) { return response()->json(['success' => true, 'message' => 'Page saved']); }
}
