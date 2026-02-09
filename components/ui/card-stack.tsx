
import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Moon, Sun, RotateCcw, Shuffle, ChevronLeft, ChevronRight } from 'lucide-react';

interface Card {
    id: number;
    src: string;
    alt: string;
    title: string;
    description: string;
}

export default function CardStack() {
    const initialCards: Card[] = [
        {
            id: 1,
            src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
            alt: "Card 1",
            title: "Alpine Peaks",
            description: "Majestic snow-capped mountains"
        },
        {
            id: 2,
            src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=300&fit=crop",
            alt: "Card 2",
            title: "Tropical Paradise",
            description: "Crystal clear beach waters"
        },
        {
            id: 3,
            src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=300&fit=crop",
            alt: "Card 3",
            title: "Enchanted Forest",
            description: "Lush green wilderness"
        },
        {
            id: 4,
            src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=300&fit=crop",
            alt: "Card 4",
            title: "Misty Valley",
            description: "Dreamy landscape photography"
        },
        {
            id: 5,
            src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&h=300&fit=crop",
            alt: "Card 5",
            title: "Starry Night",
            description: "Celestial mountain views"
        },
        {
            id: 6,
            src: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=500&h=300&fit=crop",
            alt: "Card 6",
            title: "Sunset Horizon",
            description: "Golden hour magic"
        }
    ];

    const [cards, setCards] = useState<Card[]>(initialCards);
    const [isDark, setIsDark] = useState(true);
    const [dragDirection, setDragDirection] = useState<'up' | 'down' | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const dragY = useMotionValue(0);
    const rotateX = useTransform(dragY, [-200, 0, 200], [15, 0, -15]);
    const opacity = useTransform(dragY, [-200, -100, 0, 100, 200], [0, 0.5, 1, 0.5, 0]);

    const offset = 10;
    const scaleStep = 0.06;
    const swipeThreshold = 50;

    const moveToEnd = () => {
        setCards(prev => [...prev.slice(1), prev[0]]);
        setCurrentIndex((prev) => (prev + 1) % initialCards.length);
    };

    const moveToStart = () => {
        setCards(prev => [prev[prev.length - 1], ...prev.slice(0, -1)]);
        setCurrentIndex((prev) => (prev - 1 + initialCards.length) % initialCards.length);
    };

    const shuffleCards = () => {
        const shuffled = [...cards].sort(() => Math.random() - 0.5);
        setCards(shuffled);
    };

    const resetCards = () => {
        setCards(initialCards);
        setCurrentIndex(0);
    };

    const handleDragEnd = (_: any, info: any) => {
        const velocity = info.velocity.y;
        const offset = info.offset.y;

        if (Math.abs(offset) > swipeThreshold || Math.abs(velocity) > 500) {
            if (offset < 0 || velocity < 0) {
                setDragDirection('up');
                setTimeout(() => {
                    moveToEnd();
                    setDragDirection(null);
                }, 150);
            } else {
                setDragDirection('down');
                setTimeout(() => {
                    moveToStart();
                    setDragDirection(null);
                }, 150);
            }
        }
        dragY.set(0);
    };

    const theme = {
        dark: {
            bg: 'bg-zinc-950',
            text: 'text-white',
            controlBg: 'bg-zinc-900 hover:bg-zinc-800',
            border: 'border-zinc-800',
            cardBg: 'bg-zinc-900',
        },
        light: {
            bg: 'bg-zinc-50',
            text: 'text-zinc-900',
            controlBg: 'bg-white hover:bg-zinc-100',
            border: 'border-zinc-200',
            cardBg: 'bg-white',
        }
    };

    const currentTheme = isDark ? theme.dark : theme.light;

    return (
        <div className={`w-full h-[600px] flex items-center justify-center ${currentTheme.bg} transition-all duration-500 relative overflow-hidden rounded-3xl`}>
            {/* Top Controls */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-30">
                <div className="flex gap-2">
                    <button onClick={resetCards} className={`p-2 rounded-full ${currentTheme.controlBg} border ${currentTheme.border} transition-colors`}>
                        <RotateCcw className={`w-4 h-4 ${currentTheme.text}`} />
                    </button>
                    <button onClick={shuffleCards} className={`p-2 rounded-full ${currentTheme.controlBg} border ${currentTheme.border} transition-colors`}>
                        <Shuffle className={`w-4 h-4 ${currentTheme.text}`} />
                    </button>
                </div>
                <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-full ${currentTheme.controlBg} border ${currentTheme.border} transition-colors`}>
                    {isDark ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-zinc-900" />}
                </button>
            </div>

            <div className="relative w-80 h-[450px]">
                <AnimatePresence initial={false}>
                    {cards.map((card, index) => {
                        const isFirst = index === 0;
                        return (
                            <motion.div
                                key={card.id}
                                style={{
                                    zIndex: cards.length - index,
                                    y: isFirst ? dragY : index * offset,
                                    scale: 1 - index * scaleStep,
                                    rotateX: isFirst ? rotateX : 0,
                                    opacity: isFirst ? opacity : 1 - index * 0.2,
                                }}
                                drag={isFirst ? "y" : false}
                                dragConstraints={{ top: 0, bottom: 0 }}
                                onDragEnd={handleDragEnd}
                                animate={{
                                    y: index * offset,
                                    scale: 1 - index * scaleStep,
                                }}
                                className={`absolute inset-0 rounded-2xl overflow-hidden border ${currentTheme.border} ${currentTheme.cardBg} shadow-2xl cursor-grab active:cursor-grabbing`}
                            >
                                <img src={card.src} alt={card.alt} className="w-full h-1/2 object-cover" />
                                <div className="p-6">
                                    <h3 className={`text-xl font-bold ${currentTheme.text} mb-2`}>{card.title}</h3>
                                    <p className="text-zinc-500 text-sm leading-relaxed">{card.description}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Bottom Indicators */}
            <div className="absolute bottom-6 flex gap-1.5 z-30">
                {initialCards.map((_, i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-6 bg-amber-500' : 'w-1.5 bg-zinc-700'}`} />
                ))}
            </div>
        </div>
    );
}
