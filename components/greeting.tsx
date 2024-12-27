
import React, { useState, useEffect } from 'react';

const greetings = {
    "中文": "你好",
    "粤语": "食左飯未",
    "英语": "Hello",
    "西班牙语": "Hola",
    "法语": "Bonjour",
    "德语": "Hallo",
    "日语": "こんにちは",
    "韩语": "안녕하세요",
    "越南语": "Xin chào",
    "意大利语": "Ciao",
    "葡萄牙语": "Olá",
    "俄语": "Здравствуйте",
    "印地语": "Namaste",
    "阿拉伯语": "Marhaba",
    "土耳其语": "Merhaba",
};

interface GreetingProps {
  interval?: number; // 切换间隔时间,默认4秒
  className?: string; // 自定义样式类名
}

const Greeting: React.FC<GreetingProps> = ({ 
  interval = 4000,
  className = ''
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const greetingEntries = Object.entries(greetings);

    useEffect(() => {
        const timer = setInterval(() => {
        setIsAnimating(true);
        
        // 等待淡出动画完成后开始新文字动画
        setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % greetingEntries.length);
            setIsAnimating(false);
        }, 500); // 500ms 为淡出动画的时间
        }, interval);

        return () => clearInterval(timer);
    }, [interval]);

    const [currentLang, currentGreeting] = greetingEntries[currentIndex];

    // 当前文字
    const [nextText, setNextText] = useState('');

    useEffect(() => {
        let index = 1;
        setNextText(currentGreeting[0]);
        
        // 逐字显示动画
        const typeTimer = setInterval(() => {
        if (index < currentGreeting.length) {
            setNextText(prev => prev + currentGreeting[index - 1]);
            index++;
        } else {
            clearInterval(typeTimer);
        }
        }, 100); // 每个字符显示间隔 100ms

        return () => clearInterval(typeTimer);
    }, [currentGreeting]);

    return (
        <p className={`${className}`}>
            <span className="greeting">{nextText}</span><span className="cursor"></span>
        </p>
    );
};

export default Greeting;
