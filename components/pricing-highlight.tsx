'use client';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
export function PricingHighlight(){const [p,setP]=useState({price:45,discountedPrice:40});useEffect(()=>{fetch('/api/pricing').then(r=>r.json()).then(d=>{if(d.price)setP(d)}).catch(()=>{})},[]);return <div className="pricing-highlight"><div><p className="section-kicker">Preise</p><h3>2 Stunden VR-Action</h3><p>inklusive Einführung, Pause und rund 1,5 Stunden reiner Spielzeit.</p></div><div className="pricing-values"><strong>{p.price} €</strong><span>pro Person</span><b>{p.discountedPrice} €</b><small>Schüler, Lehrlinge, Präsenzdiener & Studierende unter 26</small></div></div>}
