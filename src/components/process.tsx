'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './process.module.css';
import {
  FaClipboardList,
  FaSearch,
  FaCogs,
  FaRobot,
  FaChartLine,
  FaHandsHelping,
} from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

const PROCESS_STEPS = [
  {
    icon: <FaClipboardList />,
    title: 'Initial Consultation & Audit',
    desc: 'Review systems, registers, payroll, licences.',
  },
  {
    icon: <FaSearch />,
    title: 'Gap Analysis',
    desc: 'Identify missing or non-compliant areas.',
  },
  {
    icon: <FaCogs />,
    title: 'Implementation',
    desc: 'Deploy frameworks, digital registers, payroll corrections.',
  },
  {
    icon: <FaRobot />,
    title: 'Automation',
    desc: 'Use software to streamline record-keeping & filings.',
  },
  {
    icon: <FaChartLine />,
    title: 'Monitoring & Updates',
    desc: 'Periodic audits, reminders, statutory updates.',
  },
  {
    icon: <FaHandsHelping />,
    title: 'Support',
    desc: 'Tribunal representation, inspections, government liaison.',
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(stepsRef.current, { opacity: 0, y: 80 }); // initial hidden state

      gsap.to(stepsRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.processSection} ref={sectionRef}>
      <h2 className={styles.heading}>How we Work ?!</h2>
      <div className={styles.timeline}>
        {PROCESS_STEPS.map((step, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) stepsRef.current[i] = el;
            }}
            className={styles.step}
          >
            <div className={styles.icon}>{step.icon}</div>
            <div className={styles.content}>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
