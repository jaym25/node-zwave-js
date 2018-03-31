/// <reference types="node" />
import { EventEmitter } from "events";
import { Message, MessagePriority } from "../message/Message";
import { ZWaveController } from "./Controller";
export interface ZWaveOptions {
    timeouts: {
        /** how long to wait for an ACK */
        ack: number;
        /** not sure */
        byte: number;
    };
}
export declare type DeepPartial<T> = {
    [P in keyof T]: Partial<T[P]>;
};
export declare type MessageSupportCheck = "loud" | "silent" | "none";
export declare class Driver extends EventEmitter {
    private port;
    /** @internal */
    options: DeepPartial<ZWaveOptions>;
    /** The serial port instance */
    private serial;
    /** A buffer of received but unprocessed data */
    private receiveBuffer;
    /** The currently pending request */
    private currentTransaction;
    private sendQueue;
    private _controller;
    readonly controller: ZWaveController;
    constructor(port: string, 
        /** @internal */
        options?: DeepPartial<ZWaveOptions>);
    private _wasStarted;
    private _isOpen;
    /** Start the driver */
    start(): Promise<void>;
    private beginInterview();
    private reset();
    private _wasDestroyed;
    private ensureReady();
    private _cleanupHandler;
    /**
     * Terminates the driver instance and closes the underlying serial connection.
     * Must be called under any circumstances.
     */
    destroy(): void;
    private serialport_onError(err);
    private onInvalidData();
    private serialport_onData(data);
    private handleResponse(msg);
    private handleRequest(msg);
    private handleACK();
    private handleNAK();
    private handleCAN();
    /**
     * Sends a message with default priority to the Z-Wave stick
     * @param msg The message to send
     * @param supportCheck How to check for the support of the message to send. If the message is not supported:
     * * "loud" means the call will throw
     * * "silent" means the call will resolve with `undefined`
     * * "none" means the message will be sent anyways. This is useful if the capabilities haven't been determined yet.
     * @param priority The priority of the message to send. If none is given, the defined default priority of the message
     * class will be used.
     */
    sendMessage<TResponse extends Message = Message>(msg: Message, priority?: MessagePriority): Promise<TResponse>;
    sendMessage<TResponse extends Message = Message>(msg: Message, supportCheck?: MessageSupportCheck): Promise<TResponse>;
    sendMessage<TResponse extends Message = Message>(msg: Message, priority: MessagePriority, supportCheck: MessageSupportCheck): Promise<TResponse>;
    /**
     * Sends a low-level message like ACK, NAK or CAN immediately
     * @param message The low-level message to send
     */
    private send(header);
    private sendQueueTimer;
    private workOffSendQueue();
    private doSend(data);
}
