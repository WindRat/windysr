import { Gender, HeroBasicType } from "../../resources/autogenerated/common.define";
import { Avatar, GetAvatarDataCsReq, GetAvatarDataScRsp } from "../../resources/autogenerated/cs.avatar";
import { ChangeLineupLeaderCsReq, ChangeLineupLeaderScRsp, GetAllLineupDataCsReq, GetAllLineupDataScRsp, GetLineupAvatarDataCsReq, GetLineupAvatarDataScRsp, JoinLineupCsReq, JoinLineupScRsp, LineupAvatar, LineupAvatarData, LineupInfo, SyncLineupNotify, SyncLineupReason } from "../../resources/autogenerated/cs.lineup";
import { GetHeroBasicTypeInfoCsReq, GetHeroBasicTypeInfoScRsp, GetHeroPathCsReq, GetHeroPathScRsp, HeroBasicTypeInfo } from "../../resources/autogenerated/cs.player";
import { PlayerManager } from "../game/players";
import { PacketContext, RouteManager } from "../network/route";
import { Logger } from "../utils/log";

export class AvatarHandler {
    constructor(routeManager: RouteManager) {
        routeManager.on(GetHeroBasicTypeInfoCsReq, this.GetHeroBasicTypeInfoCsReq);
        routeManager.on(GetHeroPathCsReq, this.GetHeroPathCsReq);
        routeManager.on(GetAvatarDataCsReq, this.GetAvatarDataCsReq);
        routeManager.on(GetAllLineupDataCsReq, this.GetAllLineupDataCsReq);
        routeManager.on(ChangeLineupLeaderCsReq, this.ChangeLineupLeaderCsReq);
        routeManager.on(GetLineupAvatarDataCsReq, this.GetLineupAvatarDataCsReq);
        routeManager.on(JoinLineupCsReq, this.JoinLineupCsReq);
    }

    public JoinLineupCsReq(context: PacketContext<JoinLineupCsReq>) {
        const rsp = JoinLineupScRsp.create();
        const lineup = context.player!.lineups[context.request.index!];
        lineup.avatarList[context.request.slot!] = context.request.baseAvatarId!;
        rsp.retcode = 0;
        const syncLineup = SyncLineupNotify.create({
            lineup: lineup.toLineupInfo(),
            reasonList: [
                SyncLineupReason.SYNC_REASON_MP_ADD
            ]
        })
        context.send(JoinLineupScRsp, rsp);
        context.send(SyncLineupNotify, syncLineup);
    }

    public GetLineupAvatarDataCsReq(context: PacketContext<GetLineupAvatarDataCsReq>) {
        //assuming they ask for the first lineup
        const lineup = context.player!.lineups[0];
        const rsp = GetLineupAvatarDataScRsp.create();
        rsp.retcode = 0;
        rsp.avatarDataList = lineup.toLineupAvatarData();
        context.send(GetLineupAvatarDataScRsp, rsp);
    }

    public ChangeLineupLeaderCsReq(context: PacketContext<ChangeLineupLeaderCsReq>) {
        const rsp = ChangeLineupLeaderScRsp.create();
        const lineup = context.player!.lineups[context.player!.curLineupIndex];
        lineup.leaderSlot = context.request.slot!;
        rsp.retcode = 0;
        rsp.slot = context.request.slot!;
        context.send(ChangeLineupLeaderScRsp, rsp);
    }

    public GetAllLineupDataCsReq(context: PacketContext<GetAllLineupDataCsReq>) {
        const rsp = GetAllLineupDataScRsp.create();
        rsp.retcode = 0;
        rsp.lineupList = context.player!.lineups.map(lineup => lineup.toLineupInfo());
        context.send(GetAllLineupDataScRsp, rsp);
    }

    public GetAvatarDataCsReq(context: PacketContext<GetAvatarDataCsReq>) {
        const player = PlayerManager.players.get(1)!;
        const rsp = GetAvatarDataScRsp.create();
        rsp.avatarList = player.avatars;
        rsp.retcode = 0;
        rsp.isAll = context.request.isGetAll!;
        context.send(GetAvatarDataScRsp, rsp);
    }

    public GetHeroPathCsReq(context: PacketContext<GetHeroPathCsReq>) {
        const rsp = GetHeroPathScRsp.create();
        rsp.retcode = 0;
        rsp.heroPathList = [];
        context.send(GetHeroPathScRsp, rsp);
    }

    public GetHeroBasicTypeInfoCsReq(context: PacketContext<GetHeroBasicTypeInfoCsReq>) {
        const rsp = GetHeroBasicTypeInfoScRsp.create();
        rsp.retcode = 0;
        rsp.gender = Gender.GenderMan;
        rsp.isPlayerInfoModified = true;
        rsp.isGenderModified = true;
        rsp.heroPathList = [];
        rsp.curBasicType = HeroBasicType.BoyKnight;
        rsp.basicTypeInfoList = [
            HeroBasicTypeInfo.create({
                basicType: HeroBasicType.BoyKnight,
                rank: 1,
                skillTreeList: []
            })
        ];
        context.send(GetHeroBasicTypeInfoScRsp, rsp);
    }
}