// services/WebSocketService.ts
type WebSocketMessage = {
  type: string;
  payload: unknown;
};

type EventHandler = (payload: unknown) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private eventHandlers: Map<string, EventHandler[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private connectionPromise: Promise<void> | null = null;
  private url: string = '';

  constructor(private logger: Console = console) {}

  async connect(url: string): Promise<void> {
    this.url = url;
    
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
          this.logger.log('WebSocket connected');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.socket.onmessage = (event) => {
          this.handleMessage(event);
        };

        this.socket.onerror = (error) => {
          this.logger.error('WebSocket error:', error);
          reject(error);
        };

        this.socket.onclose = (event) => {
          this.logger.log('WebSocket closed:', event.code, event.reason);
          this.handleDisconnection();
        };
      } catch (error) {
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  private handleDisconnection() {
    this.connectionPromise = null;
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.logger.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.connect(this.url), this.reconnectDelay);
    } else {
      this.logger.error('Max reconnection attempts reached');
    }
  }

  private handleMessage(event: MessageEvent) {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      const handlers = this.eventHandlers.get(message.type) || [];
      
      handlers.forEach(handler => {
        try {
          handler(message.payload);
        } catch (error) {
          this.logger.error(`Error in handler for ${message.type}:`, error);
        }
      });
    } catch (error) {
      this.logger.error('Error parsing WebSocket message:', error);
    }
  }

  on(eventType: string, handler: EventHandler): () => void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }

    const handlers = this.eventHandlers.get(eventType)!;
    handlers.push(handler);

    return () => {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    };
  }

  send(message: WebSocketMessage): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    this.socket.send(JSON.stringify(message));
  }

  createMeeting(title: string, participants: string[]): void {
    this.send({
      type: 'create_meeting',
      payload: { title, participants }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.connectionPromise = null;
    this.reconnectAttempts = 0;
  }
}

export default WebSocketService;
