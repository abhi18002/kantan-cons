/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Space, Image, Form, Input, notification } from 'antd';
import React, { useEffect, useRef } from 'react';
import TextArea from 'antd/lib/input/TextArea';
import gsap from 'gsap';
import { ScrollTrigger, MotionPathPlugin, DrawSVGPlugin } from 'gsap/all';
import SketchCarousel from '../components/carousel';
import { useRouter } from 'next/router';
import { EDGE_POINTS, REQUIRED_MESSAGE, SERVICES_DATA } from '../constants';
import Process from '../components/process';
import { useForm } from 'antd/es/form/Form';
import HandBottom from '../icons/hand_bottom';
import styles from './index.module.css';

export default function LandingMobile() {
  const url = process.env.NEXT_PUBLIC_API_URL || '';
  const router = useRouter();
  const [form] = useForm();

  const handleSubmit = async (formData: any) => {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        notification.success({ message: 'Message sent successfully!' });
        form.resetFields();
      } else {
        console.log('Failed to send message.');
      }
    } catch (err) {
      console.error('error', err);
    }
  };

  const videoRef = useRef(null);
  const headingRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const aboutTextRef = useRef<HTMLDivElement>(null);
  const aboutSectionRef = useRef<HTMLDivElement>(null);
  const serviceRefs = useRef<HTMLDivElement[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const fallbackDraw = (elements: any) => {
    elements.forEach((el: any, i: any) => {
      try {
        const length =
          typeof (el as any).getTotalLength === 'function'
            ? (el as any).getTotalLength()
            : (() => {
                const bbox = (el as SVGGraphicsElement).getBBox();
                return (Math.max(bbox.width, bbox.height) || 100) * 4;
              })();

        gsap.set(el, {
          strokeDasharray: length,
          strokeDashoffset: length,
          stroke: (el as SVGElement).getAttribute('stroke') || '#35789F',
          strokeWidth: (el as SVGElement).getAttribute('stroke-width') || 2,
          fill: 'none',
          opacity: 1,
        });

        gsap.to(el, {
          strokeDashoffset: 0,
          duration: Math.min(Math.max(length / 200, 0.8), 2.4),
          delay: i * 0.08,
          ease: 'power2.out',
          onComplete: () => {
            const targetFill =
              (el as SVGElement).getAttribute('data-fill') ||
              (el as SVGElement).getAttribute('fill') ||
              'none';
            if (targetFill && targetFill !== 'none') {
              gsap.to(el, { fill: targetFill, duration: 0.8 });
            }
          },
        });
      } catch (err) {
        console.warn('Fallback draw: failed for element', el, err);
      }
    });
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(videoRef.current, {
      yPercent: 5,
      ease: 'none',
      scrollTrigger: {
        trigger: `.${styles['container']}`,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    gsap.to(`.${styles['overlay']}`, {
      yPercent: -25,
      opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: `.${styles['container']}`,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, DrawSVGPlugin);
    if (!svgRef.current) return;
    const elements = svgRef.current.querySelectorAll('.draw');
    let drewWithPlugin = false;

    (async () => {
      try {
        let DrawSVG: any = null;
        try {
          DrawSVG = (await import('gsap/DrawSVGPlugin')).DrawSVGPlugin;
        } catch (e) {
          try {
            DrawSVG = (await import('gsap/dist/DrawSVGPlugin')).DrawSVGPlugin;
          } catch (e2) {
            DrawSVG = null;
          }
        }
        if (DrawSVG) {
          gsap.registerPlugin(DrawSVG);
          elements.forEach((el, i) => {
            if (!(el as SVGElement).getAttribute('stroke')) {
              (el as SVGElement).setAttribute('stroke', '#35789F');
              (el as SVGElement).setAttribute('stroke-width', '2');
            }
            gsap.fromTo(
              el,
              { drawSVG: '0%' },
              {
                drawSVG: '100%',
                duration: 5,
                delay: i * 0.08,
                ease: 'power2.out',
                onComplete: () => {
                  const targetFill =
                    (el as SVGElement).getAttribute('data-fill') ||
                    (el as SVGElement).getAttribute('fill') ||
                    'none';
                  if (targetFill && targetFill !== 'none') {
                    gsap.to(el, { fill: targetFill, duration: 6 });
                  }
                },
              }
            );
          });
          drewWithPlugin = true;
        } else {
          fallbackDraw(elements);
        }
      } catch (err) {
        console.error('Error while loading DrawSVGPlugin', err);
        fallbackDraw(elements);
      }
    })();

    const fallbackTimeout = setTimeout(() => {
      if (!drewWithPlugin) {
        fallbackDraw(elements);
      }
    }, 900);

    serviceRefs.current.forEach((service, i) => {
      gsap.fromTo(
        service,
        { opacity: 0, x: i % 2 === 0 ? -50 : 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: service,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => clearTimeout(fallbackTimeout);
  }, []);

  return (
    <>
      <div
        className={`${styles['container']} ${styles['mobile-view']}`}
        style={{ overflowX: 'hidden' }}
      >
        <video
          loop
          muted
          autoPlay
          playsInline
          preload='auto'
          className={styles['video']}
          ref={videoRef}
        >
          <source src='/ld1.mp4' type='video/mp4' />
        </video>

        <div className={styles['layout']}>
          {/* <div className='nav-container'>
            <input id='toggle' type='checkbox' />

            <label className='toggle-container' htmlFor='toggle'>
              <span className='button button-toggle'></span>
            </label>

            <nav className='nav'>
              <a className='nav-item' href=''>
                Dashboard
              </a>
              <a className='nav-item' href=''>
                History
              </a>
              <a className='nav-item' href=''>
                Statistics
              </a>
              <a className='nav-item' href=''>
                Settings
              </a>
            </nav>
          </div> */}

          <div className={styles['overlay']}>
            <Space
              direction='vertical'
              style={{
                backgroundColor: 'transparent',
                zIndex: 110,
                width: '100%',
                color: 'white',
              }}
            >
              <div className={styles['heading']}>
                <Image
                  alt='KC'
                  src='/logo_light.png'
                  preview={false}
                  height={150}
                />
              </div>
              <h1 className={styles['heading']} ref={headingRef}>
                <p>KANTAN</p> CONSULTANCY PVT. LTD.
              </h1>
              <p className={styles['subheading']}>
                Software-Powered Labour Compliance & Statutory Management for
                Every Industry
              </p>
              <br />
              <p className={styles['text']}>
                From employee records to payroll to tribunal cases — we keep
                your business legally compliant, transparent, and
                inspection-ready, always.
              </p>
            </Space>
          </div>
        </div>
      </div>

      <div
        className={styles['about']}
        id='about'
        ref={aboutSectionRef}
        style={{ height: 'max-content' }}
      >
        <div ref={containerRef}>
          <Space className={styles['layout']} direction='vertical'>
            <div
              className={`${styles['about-heading']} ${styles['about-text']}`}
            >
              <h1>About Us</h1>
            </div>
            <Space direction='vertical' ref={aboutTextRef}>
              <p className={styles['about-content-text']}>
                We are a specialized HR & Labour Compliance consultancy helping
                organizations across industries stay legally compliant.
                <br />
                <br />
                Our software-powered processes transform employee records —
                working hours, holidays, leave benefits, salaries, payroll,
                registers — into fully compliant documentation aligned with all
                statutory laws and regulatory standards.
              </p>
              <br />
              <p
                style={{
                  color: '#d6c7b0',
                  fontSize: '1.2em',
                  letterSpacing: '0.5px',
                  fontWeight: 600,
                  opacity: 0.9,
                  marginTop: '10px',
                }}
              >
                Whatever your current system, we bring it up to code.
              </p>
            </Space>
            <Space
              size={20}
              className={styles['about-sub-content']}
              direction='vertical'
            >
              <div className={styles['svg-container']}>
                <svg
                  ref={svgRef}
                  width='400'
                  height='450'
                  viewBox='0 0 1000 1200'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <HandBottom />
                </svg>
              </div>
              <Space
                className={styles['mission-vision']}
                direction='vertical'
                size={50}
              >
                <Space direction='vertical'>
                  <h1>Our Mission</h1>
                  <div className={styles['underline']} />
                  <br />
                  <p>
                    To simplify compliance, reduce risks, and empower businesses
                    to maintain fair, transparent, and lawful workplace
                    practices.
                  </p>
                </Space>
                <Space direction='vertical'>
                  <h1>Our Vision</h1>
                  <div className={styles['underline']} />
                  <br />
                  <p>
                    To be the trusted partner in compliance management,
                    delivering software-driven solutions that keep businesses
                    inspection-ready at all times.
                  </p>
                </Space>
              </Space>
            </Space>
          </Space>
        </div>
      </div>

      {/* Our Edge Section */}
      <div className={`${styles['about']} ${styles['edge']}`}>
        <Space direction='vertical'>
          <h2
            style={{
              fontSize: '2.2em',
              textAlign: 'center',
              color: '#dadfeaff',
              margin: '50px',
            }}
          >
            Our Edge
          </h2>
          <p
            style={{
              fontSize: '1em',
              color: '#dadfeaff',
              maxWidth: '900px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Discover what sets us apart in fortifying your digital frontier.
          </p>
          <br />
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '30px',
              margin: '0 auto',
            }}
          >
            {EDGE_POINTS.map((card, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#2A3A4A',
                  borderRadius: '12px',
                  padding: '35px',
                  width: '350px',
                  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.35)',
                  textAlign: 'left',
                  border: '1px solid #4CAFDF',
                  transition: 'transform 0.3s ease-in-out',
                }}
              >
                <div
                  style={{
                    fontSize: '2em',
                    color: '#4CAFDF',
                    marginBottom: '15px',
                  }}
                >
                  {card.icon}
                </div>
                <h3
                  style={{
                    color: '#F8FAFC',
                    fontSize: '1.4rem',
                    marginBottom: '10px',
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    color: '#B0C2D5',
                    // lineHeight: 1.6,
                    fontSize: '20px',
                  }}
                >
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </Space>
      </div>

      {/* Services Section */}
      <div className={styles['services']} id='services'>
        <Space direction='vertical' align='center' size='large'>
          <div className={styles['service-heading']}>
            <h1>Our Services</h1>
          </div>
          <div className={styles['services-section']}>
            {SERVICES_DATA.map((service, index) => (
              <div
                key={service.title}
                className={`${styles['service-item']} ${
                  index % 2 === 1 ? styles['even'] : styles['odd']
                }`}
                ref={(el) => {
                  if (el) serviceRefs.current[index] = el;
                }}
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  margin: '0 0',
                  padding: '0 10px',
                }}
              >
                <div className={styles['service-image-wrapper']}>
                  <svg
                    className={styles['service-bg']}
                    viewBox='0 0 500 300'
                    xmlns='http://www.w3.org/2000/svg'
                    preserveAspectRatio='none'
                  >
                    <path
                      d={service.bgPath}
                      fill={service.bgColor}
                      opacity='0.4'
                    />
                  </svg>
                  <img
                    src={service.image}
                    alt={service.title}
                    className={styles['service-image']}
                  />
                </div>
                <div className={styles['service-content']}>
                  <h3 className={styles['service-title']}>{service.title}</h3>
                  <p>{service.intro}</p>
                  <br />
                  <ul>
                    {service.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Space>
      </div>

      {/* Industries Section */}
      <div className={styles['industries']} id='industries'>
        <Space direction='vertical' align='center' size='large'>
          <div>
            <h2>
              <strong>Industries We Serve</strong>
            </h2>
          </div>
          <h4>
            No matter your industry, our software-powered compliance solutions
            keep you safe, legal, and audit-ready.
          </h4>
          <br />
          <div className={styles['carousel-wrapper']}>
            <SketchCarousel />
          </div>
        </Space>
      </div>

      <div id='process'>
        <Process />
      </div>

      <div id='contact'>
        <Space direction='vertical'>
          <Space
            direction='vertical'
            style={{
              width: '600px',
              textAlign: 'left',
              lineHeight: 2,
              margin: '20px',
            }}
          >
            <h2 color=''>Contact Us</h2>
            <p style={{ fontSize: '22px', fontWeight: '800' }}>
              KANTAN CONSULTANCY PVT. LTD.
            </p>

            <p>
              48, KRK Nagar,
              <br />
              Veerakeralam, Coimbatore - 641007
              <br />
              info@kantanconsultancy.com <br />
              Ph: 9566628016, 9566628012
            </p>
          </Space>

          <Space direction='vertical' className={styles['contact-form']}>
            <Form onFinish={handleSubmit} form={form}>
              <p>Name</p>
              <br />
              <Form.Item
                name='name'
                rules={[{ required: true, message: REQUIRED_MESSAGE }]}
              >
                <Input className='input' type='text' />
              </Form.Item>
              <p>Email</p>
              <br />
              <Form.Item
                name='email'
                rules={[{ required: true, message: REQUIRED_MESSAGE }]}
              >
                <Input className='input' type='email' />
              </Form.Item>
              <p>Phone</p>
              <br />
              <Form.Item
                name='phone'
                rules={[{ required: true, message: REQUIRED_MESSAGE }]}
              >
                <Input className='input' type='number' />
              </Form.Item>
              <p>Leave us a message..</p>
              <br />
              <Form.Item
                name='message'
                rules={[{ required: true, message: REQUIRED_MESSAGE }]}
              >
                <TextArea className='input' />
              </Form.Item>
              <Form.Item className='contact'>
                <button type='submit'>
                  <span>Submit</span>
                </button>
              </Form.Item>
            </Form>
          </Space>
        </Space>
      </div>
    </>
  );
}
