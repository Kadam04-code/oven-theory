import { useState } from 'react';
import {
    Github,
    Linkedin,
    Instagram,
    Mail,
    Phone,
    MapPin,
    Clock,
    Send,
    User,
    CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const developers = [
    {
        name: "Ankita Sagar Kadam",
        role: "Full Stack Developer",
        image: "/images/ankita_kadam.jpg",
        socials: {
            github: "https://github.com/Kadam04-code/",
            linkedin: "https://www.linkedin.com/in/ankita-kadam-904a552ab",
            instagram: "https://www.instagram.com/ankitakadam__10/",
            email: "ankitacreation165@gmail.com"
        }
    },
    {
        name: "Navika Tejas Hivrale",
        role: "Backend Specialist",
        image: "/images/navika_hivrale.jpg",
        socials: {
            github: "https://github.com/revati1102",
            linkedin: "https://www.linkedin.com/in/navika-hivrale-734ab5306",
            instagram: "https://www.instagram.com/revtii_1109",
            email: "navikahivrale@gmail.com"
        }
    }
];

const ContactPage = () => {
    const [sending, setSending] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);

        try {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiBaseUrl}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSubmitted(true);
                toast.success(data.message || "Message sent successfully!");
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                toast.error(data.error || "Failed to send message. Please try again.");
            }
        } catch (error) {
            console.error('Submission error:', error);
            toast.error("Network error. Please make sure the server is running.");
        } finally {
            setSending(false);
        }
    };


    return (
        <div className="min-h-screen relative overflow-hidden bg-background">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container relative mx-auto px-4 py-16 animate-fade-in">
                {/* Header Section */}
                <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
                    <div className="inline-block px-4 py-1.5 mb-2 rounded-full bg-accent/10 border border-accent/20 text-accent font-medium text-sm animate-slide-in">
                        Get In Touch
                    </div>
                    <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight text-foreground">
                        We'd Love to <span className="text-accent decoration-primary/20 decoration-8">Hear From You</span>
                    </h1>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-body leading-relaxed">
                        Whether you have a question about our treats, need a custom order, or just want to say hello, we're here for you.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
                    {/* Contact Info - Column 1 (4/12) */}
                    <div className="lg:col-span-5 space-y-6 animate-slide-in">
                        <div className="grid gap-6">
                            {/* Contact Card: Location */}
                            <Card className="glass-card border-none shadow-md hover:shadow-xl transition-all duration-300 group">
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-display text-xl font-bold mb-1">Our Bakery</h3>
                                        <p className="text-muted-foreground font-body">Near Gram Panchayat, Unchgaon<br />Kolhapur, Maharashtra 416004</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Contact Card: Phone */}
                            <Card className="glass-card border-none shadow-md hover:shadow-xl transition-all duration-300 group">
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-display text-xl font-bold mb-1">Call Us</h3>
                                        <p className="text-muted-foreground font-body">+91 8237382845</p>
                                        <p className="text-muted-foreground font-body">Mon - Sat, 8:00am - 10:00pm</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Contact Card: Email */}
                            <Card className="glass-card border-none shadow-md hover:shadow-xl transition-all duration-300 group">
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-warm-gold/10 text-warm-gold group-hover:bg-warm-gold group-hover:text-white transition-colors duration-300">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-display text-xl font-bold mb-1">Email Support</h3>
                                        <p className="text-muted-foreground font-body">navikahivrale@gmail.com</p>
                                        <p className="text-muted-foreground font-body">ankitacreation165@gmail.com</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Hours Card */}
                            <Card className="glass-card border-none shadow-md hover:shadow-xl transition-all duration-300 group">
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
                                        <Clock className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-display text-xl font-bold mb-1">Store Hours</h3>
                                        <div className="space-y-1 text-sm font-body text-muted-foreground">
                                            <div className="flex justify-between w-48 italic">
                                                <span>Mon - Fri:</span>
                                                <span className="font-semibold not-italic">7am - 8pm</span>
                                            </div>
                                            <div className="flex justify-between w-48 italic">
                                                <span>Saturday:</span>
                                                <span className="font-semibold not-italic">8am - 9pm</span>
                                            </div>
                                            <div className="flex justify-between w-48 italic text-destructive font-medium">
                                                <span>Sunday:</span>
                                                <span className="font-semibold not-italic">Closed</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Contact Form - Column 2 (7/12) */}
                    <div className="lg:col-span-7 animate-fade-in [animation-delay:200ms]">
                        <Card className="glass-card border-border/50 shadow-2xl overflow-hidden">
                            <CardHeader className="p-8 bg-gradient-to-br from-accent/5 to-transparent border-b border-border/50">
                                <CardTitle className="font-display text-3xl">Send Us a Message</CardTitle>
                                <CardDescription className="font-body text-base">Fill out the form below and we'll get back to you within 24 hours.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                {submitted ? (
                                    <div className="py-12 text-center space-y-6">
                                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4 animate-bounce">
                                            <CheckCircle2 className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-2xl font-bold font-display">Message Sent!</h3>
                                        <p className="text-muted-foreground max-w-sm mx-auto">Thank you for reaching out to Oven Theory. We've received your message and will respond shortly.</p>
                                        <Button
                                            variant="outline"
                                            onClick={() => setSubmitted(false)}
                                            className="px-8"
                                        >
                                            Send Another Message
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name</Label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="name"
                                                        placeholder="Full Name"
                                                        className="pl-10 h-11 bg-background/50"
                                                        required
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address</Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        placeholder="example@gmail.com"
                                                        className="pl-10 h-11 bg-background/50"
                                                        required
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Subject</Label>
                                            <Input
                                                id="subject"
                                                placeholder="What is this regarding?"
                                                className="h-11 bg-background/50"
                                                required
                                                value={formData.subject}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message">Your Message</Label>
                                            <Textarea
                                                id="message"
                                                placeholder="Tell us spicy details about your request..."
                                                className="min-h-[160px] bg-background/50 resize-none"
                                                required
                                                value={formData.message}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={sending}
                                            className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300"
                                        >
                                            {sending ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Sending...
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <Send className="h-5 w-5" />
                                                    Send Message
                                                </div>
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Team Section (Developers) */}
                <div className="mt-32 pt-16 border-t border-border/50 max-w-5xl mx-auto">
                    <div className="text-center mb-12 space-y-3">
                        <h2 className="font-display text-4xl font-bold">Meet the <span className="text-accent">Developers</span></h2>
                        <p className="text-muted-foreground max-w-xl mx-auto italic font-body">
                            The creative developers behind the Oven Theory platform.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                        {developers.map((dev, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center p-6 rounded-2xl bg-card/40 backdrop-blur-md border border-border/10 hover:border-accent/30 transition-all duration-500 group">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="w-60 h-60 rounded-full overflow-hidden border-4 border-background shadow-xl relative z-10 transition-transform duration-500 group-hover:scale-110">
                                        <img
                                            src={dev.image}
                                            alt={dev.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <h3 className="font-display text-2xl font-bold mb-1">{dev.name}</h3>
                                <p className="text-accent font-medium text-sm mb-4 uppercase tracking-widest">{dev.role}</p>

                                <div className="flex gap-4 mt-2">
                                    <a href={dev.socials.github} target="_blank" rel="noopener noreferrer"
                                        className="p-2 rounded-full hover:bg-accent/10 text-muted-foreground hover:text-accent transition-all duration-300">
                                        <Github className="h-5 w-5" />
                                    </a>
                                    <a href={dev.socials.linkedin} target="_blank" rel="noopener noreferrer"
                                        className="p-2 rounded-full hover:bg-accent/10 text-muted-foreground hover:text-accent transition-all duration-300">
                                        <Linkedin className="h-5 w-5" />
                                    </a>
                                    <a href={dev.socials.instagram} target="_blank" rel="noopener noreferrer"
                                        className="p-2 rounded-full hover:bg-accent/10 text-muted-foreground hover:text-accent transition-all duration-300">
                                        <Instagram className="h-5 w-5" />
                                    </a>
                                    <a href={`mailto:${dev.socials.email}`}
                                        className="p-2 rounded-full hover:bg-accent/10 text-muted-foreground hover:text-accent transition-all duration-300">
                                        <Mail className="h-5 w-5" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;

