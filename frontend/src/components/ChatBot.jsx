import { useState, useRef, useEffect } from 'react';
import { FaComments, FaPaperPlane, FaTimes } from 'react-icons/fa';

function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hello! I am your School Management Assistant. I can help you with:\n- Course schedules and timings\n- Assignment submissions and deadlines\n- Exam schedules and results\n- Attendance information\n- Grade reports\n- School events and announcements\n\nHow can I assist you today?' }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        // Add user message
        setMessages(prev => [...prev, { type: 'user', text: inputMessage }]);
        setInputMessage('');
        setIsLoading(true);

        try {
            // Using Google's Gemini API with school-specific context
            const response = await fetch(
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDLXYV5CeR6e7dahrr_F5EQIt8HyUK7dds',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `You are a School Management System Assistant. Your role is to help students with school-related queries only. 
                                You should ONLY respond to questions about:
                                - Course schedules and timings
                                - Assignment submissions and deadlines
                                - Exam schedules and results
                                - Attendance information
                                - Grade reports
                                - School events and announcements
                                
                                If the question is not related to school management, respond with: "I can only help with school management related queries. Please ask about courses, assignments, exams, attendance, grades, or school events."
                                
                                Current query: ${inputMessage}`
                            }]
                        }]
                    })
                }
            );

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            const botResponse = data.candidates[0].content.parts[0].text;

            // Add bot response
            setMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
        } catch (error) {
            console.error('Chat error:', error);
            // Fallback responses for common school-related queries
            const fallbackResponses = {
                'schedule': 'You can view your class schedule in the dashboard. It shows all your courses and their timings.',
                'exam': 'Exam schedules are available in the Exams section. You can see upcoming exams, dates, and locations.',
                'assignment': 'Your assignments are listed in the Assignments section. You can submit them there and check deadlines.',
                'grade': 'Your grades are available in the dashboard under the Academic Progress section.',
                'attendance': 'You can check your attendance record in the dashboard under the Attendance section.',
                'course': 'All your enrolled courses are listed in the dashboard. You can find details about each course there.',
                'event': 'School events and announcements are posted in the dashboard and notifications section.',
                'help': 'I can help you with:\n- Course schedules and timings\n- Assignment submissions and deadlines\n- Exam schedules and results\n- Attendance information\n- Grade reports\n- School events and announcements',
                'hello': 'Hello! I am your School Management Assistant. How can I help you with your school-related queries?',
                'hi': 'Hi! I can help you with your school management needs. What would you like to know?'
            };

            // Check if the input matches any fallback responses
            const lowerInput = inputMessage.toLowerCase();
            let fallbackResponse = "I can only help with school management related queries. Please ask about courses, assignments, exams, attendance, grades, or school events.";

            for (const [key, value] of Object.entries(fallbackResponses)) {
                if (lowerInput.includes(key)) {
                    fallbackResponse = value;
                    break;
                }
            }

            setMessages(prev => [...prev, { type: 'bot', text: fallbackResponse }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 z-50"
            >
                <FaComments className="w-6 h-6" />
            </button>

            {/* Chat Modal */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col z-50">
                    {/* Header */}
                    <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                        <h3 className="font-semibold">School Management Assistant</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-gray-200"
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg p-3 ${message.type === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    {message.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t p-4">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                                placeholder="Ask about courses, assignments, exams..."
                                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={isLoading}
                                className={`bg-blue-600 text-white p-2 rounded-lg transition-colors duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                                    }`}
                            >
                                <FaPaperPlane className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ChatBot; 