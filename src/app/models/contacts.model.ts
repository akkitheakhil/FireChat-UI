export class ContactInfo {
  uid: string;
  email: string;
  displayName: string;
  isFriend: boolean;
  hasRequested: boolean;
}

export interface Contact {
  displayName: string;
  email: string;
  uid: string;
}

export interface ContactsData {
  _id: string;
  email: string;
  contacts: Contact[];
}

export class ConnectionRequest {
  _id: string;
  uid: string;
  email: string;
  requestedUserId: string;
  requestedUserName: string;
  requestedUserEmail: string;
}
