export class MessageText {
  message: string;
  recieverId: string;
  recieverEmail: string;
  recieverDisplayName: string;
  senderDisplayName: string;
  senderId: string;
  senderEmail: string;
  timeStamp: string;
  hasRead: boolean;
}

export class Messages {
  id: string;
  email: string;
  displayName: string;
  messages: MessageText[] = [];
}

export class SendMessage {
  message: string;
  recieverId: string;
  recieverEmail: string;
  recieverDisplayName: string;
}

