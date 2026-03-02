import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    Mail,
    Trash2,
    Calendar,
    User,
    StickyNote,
    ExternalLink,
    RefreshCw,
    Search,
    Inbox
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';

interface ContactMessage {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    created_at: string;
}

const MessageManagement = () => {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiBaseUrl}/contact`);
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            } else {
                toast.error("Failed to fetch messages");
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
            toast.error("Network error fetching messages");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this message?")) return;

        try {
            const response = await fetch(`${apiBaseUrl}/contact/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                toast.success("Message deleted successfully");
                setMessages(messages.filter(msg => msg.id !== id));
            } else {
                toast.error("Failed to delete message");
            }
        } catch (error) {
            console.error("Error deleting message:", error);
            toast.error("Network error deleting message");
        }
    };

    const handleViewMessage = (message: ContactMessage) => {
        setSelectedMessage(message);
        setIsViewOpen(true);
    };

    const filteredMessages = messages.filter(msg =>
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            <Card className="border-border/50 shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 border-b border-border/50">
                    <div>
                        <CardTitle className="text-2xl font-display font-bold">Customer Messages</CardTitle>
                        <CardDescription>View and manage inquiries sent through the Contact Us page.</CardDescription>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchMessages}
                        disabled={loading}
                        className="gap-2"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="p-4 border-b border-border/50 flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, email, or content..."
                                className="pl-10 bg-background/50"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30">
                                    <TableHead className="w-[180px]">Date</TableHead>
                                    <TableHead className="w-[180px]">Sender</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead className="max-w-[300px]">Message Preview</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                            Loading messages...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredMessages.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-48 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <Inbox className="h-12 w-12 text-muted-foreground/30" />
                                                <p className="text-muted-foreground font-medium">No messages found.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredMessages.map((msg) => (
                                        <TableRow key={msg.id} className="hover:bg-muted/20 transition-colors">
                                            <TableCell className="font-medium whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-3.5 w-3.5 text-accent" />
                                                    {formatDate(msg.created_at)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-foreground flex items-center gap-1.5">
                                                        <User className="h-3.5 w-3.5" />
                                                        {msg.name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                                        <Mail className="h-3 w-3" />
                                                        {msg.email}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                {msg.subject}
                                            </TableCell>
                                            <TableCell className="max-w-[300px]">
                                                <p className="truncate text-muted-foreground italic text-sm">
                                                    "{msg.message}"
                                                </p>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleViewMessage(msg)}
                                                        title="Read Message"
                                                        className="hover:text-primary hover:bg-primary/10"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(msg.id)}
                                                        title="Delete Message"
                                                        className="hover:text-destructive hover:bg-destructive/10"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* View Message Dialog */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="sm:max-w-[600px] glass-card border-none shadow-2xl p-0 overflow-hidden">
                    {selectedMessage && (
                        <>
                            <DialogHeader className="p-8 bg-gradient-to-br from-accent/10 to-transparent border-b border-border/50">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <DialogTitle className="text-2xl font-display font-bold">{selectedMessage.subject}</DialogTitle>
                                        <DialogDescription className="font-body">
                                            Received on {formatDate(selectedMessage.created_at)}
                                        </DialogDescription>
                                    </div>
                                    <div className="p-3 bg-accent/20 rounded-full text-accent shadow-inner">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                </div>
                            </DialogHeader>
                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1">From</p>
                                        <p className="font-display text-lg font-bold">{selectedMessage.name}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1">Email</p>
                                        <p className="font-body text-accent font-medium">{selectedMessage.email}</p>
                                    </div>
                                </div>
                                <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-inner relative">
                                    <StickyNote className="absolute -top-3 -right-3 h-8 w-8 text-accent/20 rotate-12" />
                                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-3">Message Body</p>
                                    <p className="text-foreground leading-relaxed whitespace-pre-wrap font-body text-lg">
                                        {selectedMessage.message}
                                    </p>
                                </div>
                            </div>
                            <DialogFooter className="p-6 bg-muted/10 border-t border-border/50 gap-3">
                                <Button variant="outline" className="rounded-lg" asChild>
                                    <a href={`mailto:${selectedMessage.email}`}>
                                        Reply via Email
                                    </a>
                                </Button>
                                <Button
                                    variant="destructive"
                                    className="rounded-lg gap-2"
                                    onClick={() => {
                                        handleDelete(selectedMessage.id);
                                        setIsViewOpen(false);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MessageManagement;
