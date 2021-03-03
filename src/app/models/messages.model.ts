export class MessageText {
  message: string;
  recieverId: string;
  recieverEmail: string;
  senderId: string;
  senderEmail: string;
  timeStamp: string;
  hasRead: boolean;
  senderDisplayName: string;
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
}

