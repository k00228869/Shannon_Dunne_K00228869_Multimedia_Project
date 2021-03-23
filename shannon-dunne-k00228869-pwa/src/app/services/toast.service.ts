import { Injectable } from "@angular/core";

export class Message{
    content: string;
    style: string;
    dismissed: boolean = false;

    constructor(content, style) { // set content
        this.content = content;
        this.style = style || 'info';
    }
}
// import (Injectable)

@Injectable()
export class ToastService {


constructor(){}

    // TO DO:: get notification content from db

    sendMessage(content, style)
    {
        const message =  new Message(content, style); // build message
        // add new message to db
    }

    dismissMessage()
    {
        console.log('message dismissed');
        // update message in db to dismissed = true
    }
}
// sendMessage(notificationTitle, notificationOptions, info)
