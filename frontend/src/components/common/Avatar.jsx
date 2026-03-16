{/*__DESIGN_SYSTEM__={"primary":"rose-500","secondary":"zinc-900","radius":"rounded-3xl","shadow":"shadow-2xl","spacing":"generous","font":"Inter","tone":"playful social","darkMode":"media (system preference)","stack":"react+vite+tailwindcss v4"}__*/}
import React from 'react';
import { 
  Cat, Dog, Bird, Rabbit, Turtle, Fish, Snail, Bug, Rat, Squirrel, 
  Ghost, Bot, Flame, Star, Zap, Moon, Sun, Cloud, Snowflake, Leaf 
} from 'lucide-react';

export const AVATARS = [
  Cat, Dog, Bird, Rabbit, Turtle, Fish, Snail, Bug, Rat, Squirrel, 
  Ghost, Bot, Flame, Star, Zap, Moon, Sun, Cloud, Snowflake, Leaf
];

export const AVATARS_COUNT = AVATARS.length;

export default function Avatar({ index = 0, className = "", strokeWidth = 2 }) {
  // Memastikan index selalu berada dalam batas array (fallback ke index 0 jika tidak valid)
  const safeIndex = (index >= 0 && index < AVATARS_COUNT) ? index : 0;
  const CurrentIcon = AVATARS[safeIndex];

  return <CurrentIcon className={className} strokeWidth={strokeWidth} />;
}