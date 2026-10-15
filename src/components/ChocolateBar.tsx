import { useEffect, useState } from 'react';
import { BookOpen, Check, Gift, Heart, Leaf, Lock, Percent, Sparkles, Trophy } from 'lucide-react';
import type { DoorType } from '../types';

/** Pořadí kostiček v tabulce – rozházené jako u opravdového adventního kalendáře. */
const ORDER = [7, 15, 2, 20, 11, 4, 18, 1, 23, 9, 13, 6, 22, 3, 16, 10, 24, 14, 5, 19, 8, 12, 21, 17];

/** Druh kostičky – hořká, mléčná, bílá, s posypem… */
const FLAVORS = ['dark', 'milk', 'white', 'dark nuts', 'milk berry', 'dark nibs', 'white berry', 'milk nuts'];
const flavorOf = (day: number) => (day === 24 ? 'gold' : FLAVORS[(day * 5 + 3) % FLAVORS.length]);

export const typeIcon = (t?: DoorType, size = 20) => {
  switch (t) {
    case 'recipe': return <BookOpen size={size} />;
    case 'gift': return <Gift size={size} />;
    case 'discount': return <Percent size={size} />;
    case 'contest': return <Trophy size={size} />;
    case 'story': return <Heart size={size} />;
    default: return <Leaf size={size} />;
  }
};

function useCols() {
  const get = () => (innerWidth >= 860 ? 6 : innerWidth >= 340 ? 4 : 3);
  const [cols, setCols] = useState(get);
  useEffect(() => {
    const on = () => setCols(get());
    addEventListener('resize', on);
    return () => removeEventListener('resize', on);
  }, []);
  return cols;
}

interface Props {
  max: number;
  opened: Map<number, DoorType | undefined>;
  opening: number | null;
  onOpen: (day: number, el: HTMLElement) => void;
}

export function ChocolateBar({ max, opened, opening, onOpen }: Props) {
  const cols = useCols();
  return (
    <div className="bar-wrap">
      <div className="wrapper-paper" aria-hidden="true"><span>Čokoládovna Troubelice · Adventní tabulka 2026</span></div>
      <div className="bar" style={{ ['--cols' as string]: cols }} role="list" aria-label="24 adventních kostiček">
        {ORDER.map((day, i) => {
          const isOpen = opened.has(day);
          const locked = day > max;
          const today = day === max && !isOpen;
          const state = isOpen ? 'opened' : locked ? 'locked' : 'available';
          const label = `Kostička ${day}${locked ? ', odemkne se ' + day + '. prosince' : isOpen ? ', odlomená' : ', odlomit'}`;
          return (
            <div role="listitem" key={day} className="piece-slot">
              <span className="foil">
                <span className="foil-num">{day}</span>
                <span className="foil-ico">{typeIcon(opened.get(day), 16)}<Check size={12} className="tick" /></span>
              </span>
              <button
                className={`piece ${flavorOf(day)} ${state}${today ? ' today' : ''}${opening === day ? ' breaking' : ''}`}
                aria-label={label}
                aria-disabled={locked}
                onClick={(e) => onOpen(day, e.currentTarget)}
                style={{ animationDelay: `${i * 30}ms`, ['--tilt' as string]: `${((day * 37) % 22) - 11}deg` }}
              >
                <span className="piece-top">
                  <span className="piece-num">{day}</span>
                  <span className="piece-ico">{locked ? <Lock size={12} /> : day === 24 ? <Sparkles size={14} /> : null}</span>
                </span>
                {today && <span className="piece-badge">dnes</span>}
              </button>
              {opening === day && (
                <span className="crumbs" aria-hidden="true">{Array.from({ length: 10 }, (_, k) => <i key={k} style={{ ['--dx' as string]: `${(k - 5) * 9}px`, ['--d' as string]: `${k * 18}ms` }} />)}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
