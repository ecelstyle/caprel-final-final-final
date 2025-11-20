import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip } from "lucide-react";
import { toast } from "sonner";

const Messages = () => {
  const conversations = [
    {
      id: 1,
      client: "Restaurant Al Bahr",
      lastMessage: "Can we discuss the overdue payment?",
      time: "10 min ago",
      unread: 2,
      status: "urgent",
    },
    {
      id: 2,
      client: "Epicerie Safi Plus",
      lastMessage: "Order confirmed, thank you!",
      time: "2 hours ago",
      unread: 0,
      status: "normal",
    },
    {
      id: 3,
      client: "Marche Central Casa",
      lastMessage: "When will the next delivery arrive?",
      time: "Yesterday",
      unread: 1,
      status: "normal",
    },
  ];

  const currentMessages = [
    {
      sender: "Restaurant Al Bahr",
      text: "Hello, I wanted to discuss the payment for order CMD002.",
      time: "14:25",
      isClient: true,
    },
    {
      sender: "You",
      text: "Good afternoon! Of course, I'm here to help. What would you like to know?",
      time: "14:27",
      isClient: false,
    },
    {
      sender: "Restaurant Al Bahr",
      text: "We're experiencing some cash flow issues. Could we extend the payment deadline by 15 days?",
      time: "14:30",
      isClient: true,
    },
    {
      sender: "You",
      text: "I understand. Let me check with our finance team. I'll get back to you within the hour.",
      time: "14:32",
      isClient: false,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Messages</h1>
          <p className="text-muted-foreground">Communicate securely with your clients</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
              <CardDescription>{conversations.filter(c => c.unread > 0).length} unread</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    conv.id === 1 ? "bg-accent-light border-primary" : "hover:bg-accent-light/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-semibold text-sm">{conv.client}</h4>
                    {conv.unread > 0 && (
                      <Badge className="bg-primary text-xs">{conv.unread}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate mb-1">{conv.lastMessage}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{conv.time}</span>
                    {conv.status === "urgent" && (
                      <Badge variant="destructive" className="text-xs">Urgent</Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Message Thread */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Restaurant Al Bahr</CardTitle>
                  <CardDescription>C002 • Casablanca</CardDescription>
                </div>
                <Badge variant="destructive">Urgent</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Messages */}
                <div className="h-96 overflow-y-auto space-y-4 p-4 bg-accent-light/30 rounded-lg">
                  {currentMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.isClient ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          msg.isClient
                            ? "bg-background border"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <p className="text-sm mb-1">{msg.text}</p>
                        <span className={`text-xs ${msg.isClient ? "text-muted-foreground" : "text-primary-foreground/70"}`}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="space-y-2">
                  <Textarea
                    placeholder="Type your message..."
                    className="min-h-[80px] resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toast.info("Attach file functionality")}
                    >
                      <Paperclip className="h-4 w-4 mr-2" />
                      Attach
                    </Button>
                    <Button 
                      className="bg-gradient-primary hover:opacity-90"
                      onClick={() => toast.success("Message sent!")}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Messages;
