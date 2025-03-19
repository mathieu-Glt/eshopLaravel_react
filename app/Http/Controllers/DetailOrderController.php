<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\DetailOrder;
use App\Models\Order;
use App\Models\Product;

class DetailOrderController extends Controller
{
    public function addDetailOrder(Request $request)
    {
        $user = Auth::user();
        $order = Order::findOrFail($request->order_id);
        $product = Product::findOrFail($request->product_id);
        $detailOrder = new DetailOrder();
        $detailOrder->order_id = $order->id;
        $detailOrder->product_id = $product->id;
        $detailOrder->quantity = $request->quantity;
        $detailOrder->price = $product->price;
        $detailOrder->save();
        return response()->json(['message' => 'Detail de commande ajouté avec succès']);
    }
    public function removeDetailOrder(Request $request)
    {
        $user = Auth::user();
        $detailOrder = DetailOrder::where('user_id', $user->id)->where('id', $request->id)->first();
        $detailOrder->delete();
        return response()->json(['message' => 'Detail de commande supprimé avec succès']);
    }
    public function getDetailOrders()
    {
        $user = Auth::user();
        $detailOrders = DetailOrder::where('user_id', $user->id)->get();
        return response()->json($detailOrders);
    }
    public function clearDetailOrders()
    {
        $user = Auth::user();
        DetailOrder::where('user_id', $user->id)->delete();
        return response()->json(['message' => 'Detail de commande supprimé avec succès']);
    }
    public function updateDetailOrder(Request $request)
    {
        $user = Auth::user();
        $detailOrder = DetailOrder::where('user_id', $user->id)->where('id', $request->id)->first();
        $detailOrder->quantity = $request->quantity;
        $detailOrder->price = $request->price;
        $detailOrder->save();
        return response()->json(['message' => 'Detail de commande mise à jour avec succès']);
    }


}
