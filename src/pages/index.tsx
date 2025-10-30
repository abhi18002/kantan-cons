/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Space, Image, Form, Input, notification } from 'antd';
import React, { useEffect, useRef } from 'react';
import TextArea from 'antd/lib/input/TextArea';
import gsap from 'gsap';
import { ScrollTrigger, MotionPathPlugin, DrawSVGPlugin } from 'gsap/all';
import SketchCarousel from './components/carousel';
import { useRouter } from 'next/router';
import { EDGE_POINTS, REQUIRED_MESSAGE, SERVICES_DATA } from './constants';
import Process from './components/process';
import { useForm } from 'antd/es/form/Form';

import HandBottom from './icons/hand_bottom';

export default function Home() {
  const url = process.env.NEXT_PUBLIC_API_URL || '';
  const router = useRouter();
  const [form] = useForm();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        console.log('Message sent successfully!');
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
          // ensure stroke is visible: if none, give a default
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
            // then restore fill (if any)
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
    const tl = gsap.timeline();
    gsap.registerPlugin(ScrollTrigger);

    tl.from(videoRef.current, {
      opacity: 0,
      scale: 1.1,
      duration: 1.5,
      ease: 'power2.out',
    });

    tl.from(
      '.heading',
      {
        y: -50,
        opacity: 0,
        duration: 5,
        ease: 'elastic.out(1, 0.3)',
      },
      '-=0.5'
    );
    tl.from(
      '.navLink, .text, .subheading ',
      {
        y: -50,
        opacity: 0,
        duration: 0.6,
        ease: 'expoScale(0.5,7,none)',
        stagger: 0.15,
      },
      '-=4.25'
    );

    gsap.to(videoRef.current, {
      yPercent: 5,
      ease: 'none',
      scrollTrigger: {
        trigger: '.container',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    gsap.to('.overlay:not(.layout)', {
      yPercent: -25,
      opacity: 0.7,
      ease: 'none',
      scrollTrigger: {
        trigger: '.container',
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
            try {
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
            } catch (err) {
              console.warn('DrawSVG animate failed for element', el, err);
            }
          });
          drewWithPlugin = true;
        } else {
          console.info(
            'DrawSVGPlugin not found — falling back to manual dash animation.'
          );
          fallbackDraw(elements);
        }
      } catch (err) {
        console.error(
          'Error while trying to load DrawSVGPlugin, using fallback.',
          err
        );
        fallbackDraw(elements);
      }
    })();

    const fallbackTimeout = setTimeout(() => {
      if (!drewWithPlugin) {
        fallbackDraw(elements);
      }
    }, 900);
    serviceRefs.current.forEach((service, i) => {
      gsap.to(service, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: service,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    });
    return () => clearTimeout(fallbackTimeout);
  }, []);
  return (
    <>
      <div className={'container'}>
        <video
          loop
          muted
          autoPlay
          playsInline
          preload='auto'
          className={'video'}
          ref={videoRef}
        >
          <source src='/ld1.mp4' type='video/mp4' />
        </video>
        <div className='layout'>
          <div>
            <nav className='navbar'>
              <div
                className='logo'
                onClick={() => {
                  router.reload();
                }}
              ></div>
              <div className={'navLinks'}>
                <a className={'navLink'} href='#about'>
                  <p>About</p>
                </a>
                <a className={'navLink'} href='#services'>
                  <p>Services</p>
                </a>
                <a className={'navLink'} href='#industries'>
                  <p>Industries</p>
                </a>
                <a className={'navLink'} href='#process'>
                  Process
                </a>
                <a className={'navLink'} href='#contact'>
                  Contact
                </a>
              </div>
            </nav>
          </div>

          <div className={'overlay'}>
            <Space direction='vertical'>
              <div className={'heading'}>
                <Image
                  alt='KC'
                  src='/logo_light.png'
                  preview={false}
                  height={150}
                  // width={50}
                />
              </div>
              <h1 className={'heading'} ref={headingRef}>
                <p style={{ fontSize: '3.8rem' }}>KANTAN</p>
                CONSULTANCY PVT. LTD.
              </h1>
              <p className={'subheading'}>
                Software-Powered Labour Compliance & Statutory Management for
                Every Industry
              </p>
              <br />
              <p style={{ fontSize: '1.4rem' }} className='text'>
                From employee records to payroll to tribunal cases — we keep
                your business legally compliant, transparent, and
                inspection-ready, always.
              </p>
            </Space>
          </div>
        </div>
      </div>

      {/* About Section */}
      <br />
      <br />
      <div
        className='about'
        style={{
          position: 'relative',
          width: '100%',
          height: '160vh',
        }}
        id='about'
        ref={aboutSectionRef}
      >
        <div ref={containerRef}>
          <Space
            className='layout'
            style={{
              height: '100vh',
            }}
            direction='vertical'
          >
            <div className='about-heading about-text'>
              <h1>About Us</h1>
            </div>
            <Space
              direction='vertical'
              style={{ fontSize: '1.5rem' }}
              ref={aboutTextRef}
            >
              <p style={{ width: '1200px', textAlign: 'left' }}>
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
            <Space size={50} style={{ marginTop: '-30px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '500px',
                  width: '500px',
                  marginLeft: '50px',
                }}
              >
                <svg
                  ref={svgRef}
                  width='450'
                  height='500'
                  viewBox='0 0 800 400'
                  xmlns='http://www.w3.org/2000/svg'
                  style={{ overflow: 'visible', marginTop: '-250px' }}
                >
                  <HandBottom />
                </svg>
              </div>
              <Space
                style={{
                  textAlign: 'left',
                  padding: '150px',
                  alignItems: 'flex-start',
                  marginTop: '10px',
                }}
                direction='vertical'
                size={150}
              >
                <Space direction='vertical'>
                  <h1>Our Mission</h1>
                  <div className='underline' />
                  <br />
                  <p>
                    To simplify compliance, reduce risks, and empower businesses
                    to maintain fair, transparent, and lawful workplace
                    practices.
                  </p>
                </Space>

                <Space direction='vertical'>
                  <h1>Our Vision</h1>
                  <div className='underline' />
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

      <div className='about edge'>
        <Space direction='vertical'>
          <h2
            style={{
              fontSize: '2.2em',
              textAlign: 'center',
              color: '#dadfeaff',
              marginBottom: '15px',
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
                  width: '520px',
                  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.35)',
                  textAlign: 'left',
                  border: '1px solid #4CAFDF',
                  transition: 'transform 0.3s ease-in-out',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform =
                    'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform =
                    'scale(1)';
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
      <div className='services' id={'services'}>
        <Space direction='vertical' align='center' size='large'>
          <div className='service-heading'>
            <h1>Our Services</h1>
          </div>
          <div className='services-section'>
            {SERVICES_DATA.map((service, index) => (
              <div
                key={service.title}
                className={`service-item ${index % 2 === 1 ? 'even' : 'odd'}`}
                ref={(el) => {
                  if (el) serviceRefs.current[index] = el;
                }}
              >
                <div className='service-image-wrapper'>
                  <svg
                    className='service-bg'
                    viewBox='0 0 500 300' // matches the image container
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
                    className='service-image'
                  />
                </div>

                <div className='service-content'>
                  <h3 className='service-title'>{service.title}</h3>
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
      <div className='industries' id={'industries'}>
        <Space direction='vertical' align='center' size='large'>
          <div>
            <h1>
              <strong>Industries We Serve</strong>{' '}
            </h1>
          </div>
          <h4>
            No matter your industry, our software-powered compliance solutions
            keep you safe, legal, and audit-ready.
          </h4>
          <br />
          <div
            style={{
              width: '100%',
              maxWidth: '1200px',
              overflow: 'hidden',
            }}
          >
            <SketchCarousel />
          </div>
        </Space>
      </div>
      <div id='process'>
        <Process />
      </div>

      {/* Contact Section */}
      <div id='contact'>
        <Space style={{ height: '800px' }}>
          <Space
            direction='vertical'
            style={{
              width: '600px',
              textAlign: 'left',
              lineHeight: 2,
              margin: '80px',
            }}
          >
            <h2 color=''>Contact Us</h2>
            <p style={{ fontSize: '34px', fontWeight: '800' }}>
              KANTAN CONSULTANCY PVT. LTD.
            </p>

            <p>
              48, KRK Nagar, Veerakeralam, Coimbatore- 641007
              <br />
              info@kantanconsultancy.com <br />
              Ph: 9566628016, 9566628012
            </p>
          </Space>

          <Space direction='vertical'>
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
