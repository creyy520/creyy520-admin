declare namespace API {
  type CurrentUser = {
    [key: string]: any;
  };
  declare namespace UserManage {
    type GetUserParams = {
      keyword?: string;
      pagination: {
        pageNumber: number;
        showNumber: number;
      };
    };

    type GetFriendsParams = {
      userID?: string;
      pagination: {
        pageNumber: number;
        showNumber: number;
      };
    };

    type DeleteFriendParams = {
      ownerUserID: string;
      friendUserID: string;
    };

    type UserInfoItem = {
      birth?: number;
      email?: string;
      ex?: string;
      faceURL?: string;
      gender?: number;
      nickname?: string;
      phoneNumber?: string;
      userID: string;
      level?: number;
    };

    type RegisterUserInfo = {
      nickname: string;
      faceURL: string;
      birth?: number;
      gender?: number;
      email?: string;
      account?: string;
      areaCode: string;
      phoneNumber?: string;
      password: string;
    };
    type RegisterUserParams = {
      invitationCode?: string;
      verifyCode: string;
      deviceID?: string;
      autoLogin?: boolean;
      user: RegisterUserInfo;
    };

    type ResetUserPasswordParams = {
      userID: string;
      newPassword: string;
    };

    type BlockUserParams = {
      endDisableTime: string;
      userID: string;
    };
    type KickUserParams = {
      userID: string;
      platformID: number;
    };
    type UpdateAdminInfoParams = {
      nickname?: string;
      faceURL?: string;
      password?: string;
      userID: string;
    };
    type ChangeAdminPwdParams = {
      userID: string;
      newPassword: string;
      currentPassword: string;
    };
  }
  declare namespace GroupManage {
    type GetGroupParams = {
      groupName?: string;
      groupID?: string;
      pagination: {
        pageNumber: number;
        showNumber: number;
      };
    };
    type CreateGroupParams = {
      memberUserIDs: string[];
      adminUserIDs: string[];
      ownerUserID: string;
      groupInfo: Partial<GroupInfo>;
    };
    interface GroupInfo {
      groupID: string;
      groupName: string;
      notification: string;
      introduction: string;
      faceURL: string;
      ex: string;
      groupType: number;
      needVerification: number;
      lookMemberInfo: number;
      applyMemberFriend: number;
    }

    type UpdateGroupParams = {
      groupInfoForSet: Partial<GroupInfo>;
    };
    type GetGroupMembersParams = {
      userName?: string;
      groupID: string;
      pagination: {
        pageNumber: number;
        showNumber: number;
      };
    };
    type GetSomeGroupMembersParams = {
      groupID: string;
      userIDs: string[];
    };
    type MuteGroupMemebrParams = {
      mutedSeconds: number;
      userID: string;
      groupID: string;
    };
    type KickGroupMemebrParams = {
      groupID: string;
      kickedUserIDs: string[];
      reason: '';
    };
    type InviteGroupMemebrParams = {
      groupID: string;
      invitedUserIDs: string[];
      reason: '';
    };
    type UpdateGroupMemebrParams = {
      members: [
        {
          ex?: string;
          groupID: string;
          nickname?: string;
          roleLevel?: number;
          userGroupFaceUrl?: string;
          userID: string;
        },
      ];
    };
    type TransferGroupParams = {
      newOwnerUserID: string;
      oldOwnerUserID: string;
      groupID: string;
    };
  }
  declare namespace ChatLog {
    type GetChatLogParams = {
      sendID?: string;
      recvID?: string;
      msgType: number;
      sendTime?: string;
      sessionType: number;
      pagination: {
        pageNumber: number;
        showNumber: number;
      };
    };
    type GetSignalrecords = {
      operationID?: string;
      showNumber?: number;
      pageNumber?: number;
      mediaType?: string;
      senderID?: string;
      recvID?: string;
      createTime?: number;
    };
    type RevokeMessageParams = {
      conversationID: string;
      seq: number;
      userID: string;
    };
    type OfflinePushInfo = {
      desc: string;
      ex: string;
      iOSBadgeCount: boolean;
      iOSPushSound: string;
      title: string;
    };
    type BatchSendParams = {
      recvIDList: string[];
      sendID: string;
      text: string;
      pictureElem?: {
        sourcePicture: PicBaseInfo;
        bigPicture: PicBaseInfo;
        snapshotPicture: PicBaseInfo;
      };
      isSendAll: boolean;
    };
    type PicBaseInfo = {
      uuid: string;
      type: string;
      size: number;
      width: number;
      height: number;
      url: string;
    };
  }

  declare namespace NotificationManage {
    type QueryNotificationAccountParams = {
      userID?: string;
      nickName?: string;
      pagination: {
        pageNumber: number;
        showNumber: number;
      };
    };
    type UpdateNotificationAccountParams = {
      userID: string;
      nickName?: string;
      faceURL?: string;
    };
  }
  declare namespace AppManage {
    type ClintConfig = {
      adminURL?: string;
      discoverPageURL?: string;
      addFriendCtrl?: number;
      allowSendMsgNotFriend?: number;
      bossUserID?: string;
      needInvitationCodeRegister?: number;
      ordinaryUserAddFriend?: number;
    };
  }

  declare namespace OrganizationManage {
    type CreateDeartmentParams = {
      name: string;
      parentDepartmentID: string;
    };
    type UpdateDeartmentParams = {
      name: string;
      // parentID: string;
      departmentID: string;
    };
    type RemoveMemberParams = {
      list: { departmentID: string; userID: string }[];
    };
    type BlockMemberParams = {
      userID: string;
      // reason: string;
      op: 1 | 2;
    };
    type CreateUserParams = {
      user: {
        nickname: string;
        birth?: number;
        email?: string;
        englishName?: string;
        faceURL?: string;
        gender?: number;
        areaCode?: string;
        phoneNumber?: string;
        account: string;
        password: string;
      };
      departments: {
        departmentID: string;
        position: string;
      }[];
    };
    type UpdateUserInfoParams = {
      userID: string;
      birth?: number;
      email?: string;
      englishName?: string;
      faceURL?: string;
      gender?: number;
      mobile?: string;
      nickname?: string;
      telephone?: string;
    };
    type UpdateUserDepartmentParams = {
      userID: string;
      departmentID: string;
      position: string;
      station: string;
      entryTime?: number;
      terminationTime?: number;
    };
    type MoveUserDepartmentParams = {
      moves: {
        currentDepartmentID?: string;
        departmentID: string;
        position?: string;
        userID: string;
      }[];
    };
    type SortDepartment = {
      departmentID: string;
      nextDepartmentID: string;
    };
  }
  declare namespace RtcManage {
    type VideoParams = {
      pagination: {
        pageNumber: number;
        showNumber: number;
      };
      sendID: string;
      sesstionType: number;
      startTime: number;
      endTime: number;
    };
    type DeleteVideoParams = {
      sIDs: string[];
    };
    type MeetingParams = {
      pagination: {
        pageNumber: number;
        showNumber: number;
      };
      hostUserID: string;
      startTime: number;
      endTime: number;
    };
    type DeleteMeetingParams = {
      roomIDs: string[];
    };
  }

  declare namespace SplitUpload {
    interface CommonOptions {
      operationID: string;
      token: string;
    }
    interface UploadParams {
      hash: string;
      size: number;
      partSize: number;
      maxParts: number;
      cause: string;
      name: string;
      contentType: string;
    }
    interface ConfirmData {
      uploadID: string;
      parts: string[];
      cause: string;
      name: string;
      contentType: string;
    }
    interface UploadData {
      url: string;
      upload: Upload;
    }
    interface Upload {
      uploadID: string;
      partSize: number;
      sign: Sign;
    }
    interface Sign {
      url: string;
      query?: KeyForValueList[];
      header?: KeyForValueList[];
      parts: Part[];
    }
    interface Part {
      partNumber: number;
      url: string;
      query?: KeyForValueList[];
      header?: KeyForValueList[];
    }
    interface KeyForValueList {
      key: string;
      values: string[];
    }
  }
}
