<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\ExpeditionOrder;
use App\Models\Order;

class ExpeditionOrderController extends Controller
{
    public function addExpeditionOrder(Request $request)
    {
        $user = Auth::user();
        $order = Order::findOrFail($request->order_id);
        $expeditionOrder = new ExpeditionOrder();
        $expeditionOrder->order_id = $order->id;
        $expeditionOrder->transporter = $request->transporter;
        $expeditionOrder->expedition_status = $request->expedition_status;
        $expeditionOrder->expedition_date = $request->expedition_date;
        $expeditionOrder->suivi_number = $request->suivi_number;
        $expeditionOrder->save();
        return response()->json(['message' => 'Commande expédiée avec succès']);
    }
    public function removeExpeditionOrder(Request $request)
    {
        $user = Auth::user();
        $expeditionOrder = ExpeditionOrder::where('user_id', $user->id)->where('id', $request->id)->first();
        $expeditionOrder->delete();
        return response()->json(['message' => 'Commande expédiée supprimée avec succès']);
    }

    public function getExpeditionOrders()
    {
        $user = Auth::user();
        $expeditionOrders = ExpeditionOrder::where('user_id', $user->id)->get();
        return response()->json($expeditionOrders);
    }
    public function clearExpeditionOrders()
    {
        $user = Auth::user();
        ExpeditionOrder::where('user_id', $user->id)->delete();
        return response()->json(['message' => 'Commandes expédiées supprimées avec succès']);
    }
    public function updateExpeditionOrder(Request $request)
    {
        $user = Auth::user();
        $expeditionOrder = ExpeditionOrder::where('user_id', $user->id)->where('id', $request->id)->first();
        $expeditionOrder->expedition_status = $request->expedition_status;
        $expeditionOrder->save();
        return response()->json(['message' => 'Commande expédiée mise à jour avec succès']);
    }
    public function getExpeditionOrder(Request $request)
    {
        $user = Auth::user();
        $expeditionOrder = ExpeditionOrder::where('user_id', $user->id)->where('id', $request->id)->first();
        return response()->json($expeditionOrder);
    }

}
