<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Payment;
use App\Models\Order;

class PaymentController extends Controller
{
    public function addPayment(Request $request)
    {
        $user = Auth::user();
        $order = Order::findOrFail($request->order_id);
        $payment = new Payment();
        $payment->order_id = $order->id;
        $payment->payment_method = $request->payment_method;
        $payment->payment_status = $request->payment_status;
        $payment->amount = $request->amount;
        $payment->save();
        return response()->json(['message' => 'Paiement ajouté avec succès']);
    }
    public function removePayment(Request $request)
    {
        $user = Auth::user();
        $payment = Payment::where('user_id', $user->id)->where('id', $request->id)->first();
        $payment->delete();
        return response()->json(['message' => 'Paiement supprimé avec succès']);
    }
    public function getPayments()
    {
        $user = Auth::user();
        $payments = Payment::where('user_id', $user->id)->get();
        return response()->json($payments);
    }
    public function clearPayments()
    {
        $user = Auth::user();
        Payment::where('user_id', $user->id)->delete();
        return response()->json(['message' => 'Paiements supprimés avec succès']);
    }
    public function updatePayment(Request $request)
    {
        $user = Auth::user();
        $payment = Payment::where('user_id', $user->id)->where('id', $request->id)->first();
        $payment->payment_method = $request->payment_method;
        $payment->payment_status = $request->payment_status;
        $payment->amount = $request->amount;
        $payment->save();
        return response()->json(['message' => 'Paiement mis à jour avec succès']);
    }
}