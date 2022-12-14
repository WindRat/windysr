import { GetShopListCsReq, GetShopListScRsp } from "../../resources/autogenerated/cs.shop";
import { PacketContext, RouteManager } from "../network/route";

export class ShopHandler{

    constructor(routeManager: RouteManager){
        routeManager.on(GetShopListCsReq, this.GetShopListCsReq);
    }

    public GetShopListCsReq(context: PacketContext<GetShopListCsReq>){
        const rsp = GetShopListScRsp.create();
        rsp.retcode = 0;
        rsp.shopList = [];
        rsp.shopType = 0;
        context.send(GetShopListScRsp, rsp);
    }
}