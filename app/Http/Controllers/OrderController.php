<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Order;

class OrderController extends Controller
{
    public function addOrder(Request $request)
    {
        $user = Auth::user();
        $order = new Order();
        $order->user_id = $user->id;
        $order->status = $request->status;
        $order->date_order = $request->date_order;
        $order->save();
        return response()->json(['message' => 'Commande ajoutée avec succès']);
    }
    public function removeOrder(Request $request)
    {
        $user = Auth::user();
        $order = Order::where('user_id', $user->id)->where('id', $request->id)->first();
        $order->delete();
        return response()->json(['message' => 'Commande supprimée avec succès']);
    }
    public function getOrders()
    {
        $user = Auth::user();
        $orders = Order::where('user_id', $user->id)->get();
        return response()->json($orders);
    }
    public function clearOrders()
    {
        $user = Auth::user();
        Order::where('user_id', $user->id)->delete();
        return response()->json(['message' => 'Commandes supprimées avec succès']);
    }
    public function updateOrder(Request $request)
    {
        $user = Auth::user();
        $order = Order::where('user_id', $user->id)->where('id', $request->id)->first();
        $order->status = $request->status;
        $order->date_order = $request->date_order;
        $order->save();
        return response()->json(['message' => 'Commande mise à jour avec succès']);
    }
    public function getOrder(Request $request)
    {
        $user = Auth::user();
        $order = Order::where('user_id', $user->id)->where('id', $request->id)->first();
        return response()->json($order);
    }
    public function getOrdersByStatus(Request $request)
    {
        $user = Auth::user();
        $orders = Order::where('user_id', $user->id)->where('status', $request->status)->get();
        return response()->json($orders);
    }
    public function getOrdersByDate(Request $request)
    {
        $user = Auth::user();
        $orders = Order::where('user_id', $user->id)->where('date_order', $request->date_order)->get();
        return response()->json($orders);
    }
    public function getOrdersByDateRange(Request $request)
    {
        $user = Auth::user();
        $orders = Order::where('user_id', $user->id)->whereBetween('date_order', [$request->start_date, $request->end_date])->get();
        return response()->json($orders);
    }




}
