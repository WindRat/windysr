import { AvatarType, Gender, HeroBasicType } from "../../resources/autogenerated/common.define";
import { AvatarSkillTree } from "../../resources/autogenerated/common.gamecore";
import { Avatar, GetAvatarDataCsReq, GetAvatarDataScRsp } from "../../resources/autogenerated/cs.avatar";
import { ExtraLineupType, GetAllLineupDataCsReq, GetAllLineupDataScRsp, LineupAvatar, LineupInfo } from "../../resources/autogenerated/cs.lineup";
import { GetHeroBasicTypeInfoCsReq, GetHeroBasicTypeInfoScRsp, GetHeroPathCsReq, GetHeroPathScRsp, HeroBasicTypeInfo } from "../../resources/autogenerated/cs.player";
import { PacketContext, RouteManager } from "../network/route";

export class HeroHandler {
    constructor(routeManager: RouteManager) {
        routeManager.on(GetHeroBasicTypeInfoCsReq, this.GetHeroBasicTypeInfoCsReq);
        routeManager.on(GetHeroPathCsReq, this.GetHeroPathCsReq);
        routeManager.on(GetAvatarDataCsReq, this.GetAvatarDataCsReq);
        routeManager.on(GetAllLineupDataCsReq, this.GetAllLineupDataCsReq);
    }

    public GetAllLineupDataCsReq(context: PacketContext<GetAllLineupDataCsReq>) {
        const rsp = GetAllLineupDataScRsp.create();
        rsp.curIndex = 1;
        rsp.retcode = 0;
        rsp.lineupList = [
            LineupInfo.create({
                avatarList: [
                    LineupAvatar.create({
                        avatarType: AvatarType.AVATAR_FORMAL_TYPE,
                        hp: 1000,
                        id: 1001,
                        satiety: 10,
                        slot: 1,
                        sp: 1,
                    })
                ],
                name: "CloudySR",
                extraLineupType: ExtraLineupType.LINEUP_NONE,
                index: 0,
                leaderSlot: 0,
                planeId: 10000,
                isVirtual: true,
                mp: 0
            })
        ]
        context.send(GetAllLineupDataScRsp, rsp);
    }

    public GetAvatarDataCsReq(context: PacketContext<GetAvatarDataCsReq>) {
        console.log(context.request.baseAvatarIdList)
        const rsp = GetAvatarDataScRsp.create();
        rsp.avatarList = [
            Avatar.create({
                baseAvatarId: 1001,
                equipRelicList: [],
                equipmentUniqueId: 0,
                exp: 0,
                level: 60,
                promotion: 1,
                rank: 1,
                skilltreeList: [
                    AvatarSkillTree.create({
                        level: 1,
                        pointId: 100101
                    }),
                ],
            })
        ];

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
        rsp.isPlayerInfoModified = false;
        rsp.isGenderModified = false;
        rsp.heroPathList = [];
        rsp.curBasicType = HeroBasicType.BoyKnight;
        rsp.basicTypeInfoList = [
            HeroBasicTypeInfo.create({
                basicType: HeroBasicType.BoyKnight,
                rank: 1,
                skillTreeList: [
                    AvatarSkillTree.create({
                        level: 1,
                        pointId: 100101
                    }),
                ],
            })
        ];
        context.send(GetHeroBasicTypeInfoScRsp, rsp);
    }
}