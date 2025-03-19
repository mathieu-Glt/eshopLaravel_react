<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DebugAuth
{
    public function handle(Request $request, Closure $next)
    {
        Log::info('Debug Auth Headers', [
            'all_headers' => $request->headers->all(),
            'authorization' => $request->header('Authorization'),
            'bearer_token' => $request->bearerToken(),
            'user' => $request->user(),
            'is_authenticated' => auth()->check(),
            'route' => $request->route()->getName(),
            'method' => $request->method(),
            'url' => $request->url(),
        ]);

        return $next($request);
    }
}