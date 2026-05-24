import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const totalSlides = 4;

    useEffect(() => {
        let interval;
        if (!isPaused) {
            interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % totalSlides);
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isPaused, totalSlides]);

    const handlePrev = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const handleNext = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const togglePause = () => {
        setIsPaused(!isPaused);
    };

    const getSlideClass = (index) => {
        if (index === currentSlide) {
            return 'opacity-100 translate-x-0';
        }
        return 'opacity-0 translate-x-full pointer-events-none';
    };

    const getDotClass = (index) => {
        if (index === currentSlide) {
            return 'w-8 bg-primary';
        }
        return 'w-4 bg-white/10';
    };

    return (
        <div className="font-body-md text-on-surface overflow-x-hidden min-h-screen bg-background">
            {/* Top Navigation Bar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-glass-bg backdrop-blur-xl border-b border-border-subtle">
                <div className="flex justify-between items-center px-6 lg:px-margin-lg h-20 max-w-container-max mx-auto">
                    <div className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-2 md:text-headline-md">
                        <span className="hidden sm:inline font-bold">CreatorBoost.ai</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <a href="#features" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-200">Features</a>
                        <a href="#how-it-works" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-200">How it Works</a>
                    </nav>
                    <div className="flex items-center gap-3 md:gap-4">
                        <Link to="/login" className="border border-border-subtle text-on-surface font-label-md text-label-md px-4 md:px-6 py-2 md:py-2.5 rounded-xl hover:bg-white/5 transition-all duration-200 block">
                            Login
                        </Link>
                        <Link to="/register" className="bg-primary text-on-primary font-label-md text-label-md px-4 md:px-6 py-2 md:py-2.5 rounded-xl glow-button hover:scale-95 active:scale-90 transition-all duration-200">
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>

            <main className="mesh-gradient pt-28 md:pt-32 min-h-screen flex flex-col">
                {/* Hero Section */}
                <section className="max-w-container-max mx-auto px-6 lg:px-margin-lg text-center mb-16 md:mb-margin-lg">
                    <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl mb-6 max-w-4xl mx-auto leading-tight">
                        You Create the Content, <br />
                        We will Automate the Reach.
                    </h1>
                    <p className="font-body-lg text-body-md md:text-body-lg text-slate-gray max-w-2xl mx-auto mb-10">
                        You do the fun part—shooting and editing. We handle the rest. Just drop your video or audio file here to instantly get perfect <span className="font-semibold text-primary">titles</span>, <span className="font-semibold text-primary">descriptions</span>, <span className="font-semibold text-primary">summary</span>, <span className="font-semibold text-primary">timestamps</span>, <span className="font-semibold text-primary">captions</span>, <span className="font-semibold text-primary">hashtags</span> and <span className="font-semibold text-primary">thumbnails</span>.
                    </p>
                    <div className="flex justify-center mb-16 md:mb-20">
                        <Link to="/register" className="bg-primary text-on-primary font-label-md text-label-md px-8 py-4 rounded-xl glow-button hover:scale-105 transition-transform duration-200 w-full sm:w-auto inline-block">
                            Boost Your Content Free
                        </Link>
                    </div>

                    {/* Dynamic App Demo Preview Component */}
                    <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-md shadow-2xl overflow-hidden text-left md:scale-105">
                        {/* LEFT SIDE: Active Asset Project */}
                        <div className="flex flex-col space-y-4">
                            <div className="flex items-center justify-between">

                                <span className="ml-[5px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] md:text-[10px] font-bold border border-emerald-500/30">Content Processed Successfully</span>
                            </div>
                            <div className="p-3 md:p-4 rounded-xl bg-surface-container-low border border-border-subtle flex items-start gap-4">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-primary text-xl">movie</span>
                                </div>
                                <div>
                                    <p className="text-body-sm font-medium text-on-surface truncate max-w-[150px] md:max-w-none">final_cut_v2.mp4</p>
                                    <p className="text-[10px] text-slate-gray uppercase">Size: 18.4 MB • Format: H.264</p>
                                </div>
                            </div>
                            <div className="flex-1 p-3 md:p-4 rounded-xl bg-surface-container-low border border-border-subtle relative overflow-hidden min-h-[120px]">
                                <div className="absolute inset-x-4 top-4 bottom-4 flex flex-col gap-2">
                                    <div className="h-1.5 w-full bg-on-surface/10 rounded-full"></div>
                                    <div className="h-1.5 w-[90%] bg-on-surface/10 rounded-full"></div>
                                    <div className="h-1.5 w-[95%] bg-on-surface/10 rounded-full"></div>
                                    <div className="h-1.5 w-[80%] bg-on-surface/10 rounded-full"></div>
                                    <div className="h-1.5 w-[85%] bg-on-surface/10 rounded-full"></div>
                                    <div className="h-1.5 w-full bg-on-surface/10 rounded-full"></div>
                                    <div className="h-1.5 w-[70%] bg-on-surface/10 rounded-full"></div>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent pointer-events-none"></div>
                            </div>
                        </div>

                        {/* RIGHT SIDE: Rotating Slideshow */}
                        <div className="flex flex-col relative group mt-4 md:mt-0">
                            {/* Navigation Arrows */}
                            <button onClick={handlePrev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-20 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-slate-900/40 backdrop-blur-md border border-white/10 text-on-surface hover:bg-slate-800/60 hover:border-primary/50 hover:text-primary transition-all duration-200 active:scale-90 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-hover:translate-x-0">
                                <span className="material-symbols-outlined text-lg md:text-xl">chevron_left</span>
                            </button>
                            <button onClick={handleNext} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-20 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-slate-900/40 backdrop-blur-md border border-white/10 text-on-surface hover:bg-slate-800/60 hover:border-primary/50 hover:text-primary transition-all duration-200 active:scale-90 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-hover:translate-x-0">
                                <span className="material-symbols-outlined text-lg md:text-xl">chevron_right</span>
                            </button>
                            <div className="flex-1 min-h-[240px] md:min-h-[280px] relative overflow-hidden px-2 md:px-4">

                                {/* Slide 1 */}
                                <div className={`slide-content absolute inset-0 flex flex-col px-2 md:px-4 transition-all duration-500 ease-in-out ${getSlideClass(0)}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2 text-primary">
                                            <span className="material-symbols-outlined text-sm">auto_awesome</span>
                                            <h3 className="text-[11px] md:text-label-md font-bold tracking-[0.1em] uppercase">✨ Catchy Titles Generated</h3>
                                        </div>
                                        <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-gray hover:text-primary hover:bg-white/10 transition-all duration-200" title="Copy Content">
                                            <span className="material-symbols-outlined text-[18px]">content_copy</span>
                                        </button>
                                    </div>
                                    <div className="p-4 bg-surface-container rounded-xl border border-border-subtle flex-1">
                                        <ul className="space-y-3 text-body-sm text-on-surface-variant">
                                            <li className="p-2 bg-white/5 rounded-lg border border-white/5 text-[13px] md:text-body-sm">• 10 Mind-Blowing Tricks I Learned Editing This Video!</li>
                                            <li className="p-2 bg-white/5 rounded-lg border border-white/5 text-[13px] md:text-body-sm">• Why 99% of Content Creators Fail (And How to Fix It)</li>
                                            <li className="p-2 bg-white/5 rounded-lg border border-white/5 text-[13px] md:text-body-sm">• The Ultimate Post-Shoot Workflow Guide (2026)</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Slide 2 */}
                                <div className={`slide-content absolute inset-0 flex flex-col px-2 md:px-4 transition-all duration-500 ease-in-out ${getSlideClass(1)}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2 text-secondary">
                                            <span className="material-symbols-outlined text-sm">description</span>
                                            <h3 className="text-[11px] md:text-label-md font-bold tracking-[0.1em] uppercase">📝 Optimized Description</h3>
                                        </div>
                                        <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-gray hover:text-primary hover:bg-white/10 transition-all duration-200" title="Copy Content">
                                            <span className="material-symbols-outlined text-[18px]">content_copy</span>
                                        </button>
                                    </div>
                                    <div className="p-4 bg-surface-container rounded-xl border border-border-subtle flex-1">
                                        <p className="text-[13px] md:text-body-sm text-on-surface-variant leading-relaxed mb-4">
                                            In this project, we dive deep into the ultimate workflow shortcuts that save you hours...
                                        </p>
                                        <p className="text-[13px] md:text-body-sm text-on-surface-variant italic">
                                            📌 Timestamps below.<br />👉 Don't forget to like and subscribe!
                                        </p>
                                    </div>
                                </div>

                                {/* Slide 3 */}
                                <div className={`slide-content absolute inset-0 flex flex-col px-2 md:px-4 transition-all duration-500 ease-in-out ${getSlideClass(2)}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2 text-tertiary">
                                            <span className="material-symbols-outlined text-sm">phone_iphone</span>
                                            <h3 className="text-[11px] md:text-label-md font-bold tracking-[0.1em] uppercase">📱 Viral Shorts Captions</h3>
                                        </div>
                                        <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-gray hover:text-primary hover:bg-white/10 transition-all duration-200" title="Copy Content">
                                            <span className="material-symbols-outlined text-[18px]">content_copy</span>
                                        </button>
                                    </div>
                                    <div className="p-4 bg-surface-container rounded-xl border border-border-subtle flex-1">
                                        <div className="p-3 bg-white/5 rounded-lg border border-dashed border-white/10 text-[13px] md:text-body-sm text-on-surface-variant">
                                            Stop scrolling! 🛑 If you're still writing your video descriptions manually in 2026... 🚀<br /><br />
                                            <span className="text-primary">#creatorworkflow #growth</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Slide 4 */}
                                <div className={`slide-content absolute inset-0 flex flex-col px-2 md:px-4 transition-all duration-500 ease-in-out ${getSlideClass(3)}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2 text-on-surface-variant">
                                            <span className="material-symbols-outlined text-sm">hourglass_bottom</span>
                                            <h3 className="text-[11px] md:text-label-md font-bold tracking-[0.1em] uppercase">⏳ Smart Video Chapters</h3>
                                        </div>
                                        <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-gray hover:text-primary hover:bg-white/10 transition-all duration-200" title="Copy Content">
                                            <span className="material-symbols-outlined text-[18px]">content_copy</span>
                                        </button>
                                    </div>
                                    <div className="p-4 bg-surface-container rounded-xl border border-border-subtle flex-1">
                                        <div className="grid grid-cols-1 gap-2 font-mono text-[12px] md:text-[13px] text-on-surface-variant">
                                            <div className="flex justify-between border-b border-white/5 pb-1"><span>0:00</span> <span className="text-on-surface truncate ml-2">Intro &amp; Setup</span></div>
                                            <div className="flex justify-between border-b border-white/5 pb-1"><span>1:15</span> <span className="text-on-surface truncate ml-2">Mistakes to Avoid</span></div>
                                            <div className="flex justify-between border-b border-white/5 pb-1"><span>3:45</span> <span className="text-on-surface truncate ml-2">The Strategy</span></div>
                                            <div className="flex justify-between"><span>6:20</span> <span className="text-on-surface truncate ml-2">Final Summary</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Control Bar */}
                            <div className="flex items-center gap-4 mt-4 justify-center md:justify-start px-4">
                                <div className="flex gap-2">
                                    {[0, 1, 2, 3].map((index) => (
                                        <div key={index} className={`h-1.5 rounded-full transition-all duration-300 ${getDotClass(index)}`}></div>
                                    ))}
                                </div>
                                <button onClick={togglePause} className="flex items-center justify-center w-6 h-6 rounded-full bg-white/5 border border-white/10 text-slate-gray hover:text-primary hover:bg-white/10 transition-all duration-200 ml-2" title={isPaused ? "Resume Slideshow" : "Pause Slideshow"}>
                                    <span className="material-symbols-outlined text-[16px]">
                                        {isPaused ? 'play_arrow' : 'pause'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="max-w-container-max mx-auto px-6 lg:px-margin-lg py-16 md:py-24" id="features">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-4">Powerful Features for Modern Creators</h2>
                        <p className="font-body-md text-body-md text-slate-gray">Everything you need to scale your reach across all platforms.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-gutter">
                        <div className="glass-card p-6 md:p-8 rounded-xl hover:translate-y-[-8px] transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-primary">cloud_upload</span>
                            </div>
                            <h3 className="font-headline-md text-headline-md mb-3 text-lg">Simple File Uploads</h3>
                            <p className="font-body-sm text-body-sm text-slate-gray">Upload or drag any video or audio file. Our AI system analyses and process the entire file .</p>
                        </div>
                        <div className="glass-card p-6 md:p-8 rounded-xl hover:translate-y-[-8px] transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-secondary">smart_toy</span>
                            </div>
                            <h3 className="font-headline-md text-headline-md mb-3 text-lg"> Core Text Elements</h3>
                            <p className="font-body-sm text-body-sm text-slate-gray mb-4">The AI instantly generates :</p>
                            <ul className="font-body-sm text-body-sm text-slate-gray space-y-3 list-none">
                                <li className="flex gap-2 items-start"><span className="text-secondary mt-0.5">•</span> <span>Catchy Titles</span></li>
                                <li className="flex gap-2 items-start"><span className="text-secondary mt-0.5">•</span> <span>Detailed Description </span></li>
                                <li className="flex gap-2 items-start"><span className="text-secondary mt-0.5">•</span> <span>Clean Summaries </span></li>
                            </ul>
                        </div>
                        <div className="glass-card p-6 md:p-8 rounded-xl hover:translate-y-[-8px] transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-secondary">rocket_launch</span>
                            </div>
                            <h3 className="font-headline-md text-headline-md mb-3 text-lg"> Discovery & Engagement</h3>
                            <p className="font-body-sm text-body-sm text-slate-gray mb-4">Increase your content reach by using AI generated:</p>
                            <ul className="font-body-sm text-body-sm text-slate-gray space-y-3 list-none">
                                <li className="flex gap-2 items-start"><span className="text-secondary mt-0.5">•</span> <span>Short-Form Captions</span></li>
                                <li className="flex gap-2 items-start"><span className="text-secondary mt-0.5">•</span> <span>Hashtags</span></li>
                                <li className="flex gap-2 items-start"><span className="text-secondary mt-0.5">•</span> <span>Timestamps</span></li>
                            </ul>
                        </div>
                        <div className="glass-card p-6 md:p-8 rounded-xl hover:translate-y-[-8px] transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-tertiary">smartphone</span>
                            </div>
                            <h3 className="font-headline-md text-headline-md mb-3 text-lg">Thumbnail</h3>
                            <ul className="font-body-sm text-body-sm text-slate-gray space-y-3 list-none">
                                <li className="flex gap-2 items-start"><span className="text-tertiary mt-0.5"></span> <span>Let our AI create beautiful thumbnails:</span></li>
                                <li className="flex gap-2 items-start"><span className="text-tertiary mt-0.5"></span> <span>  We handle the design style and layout so that your content gets maximum clicks.</span></li>
                            </ul>
                        </div>
                        <div className="glass-card p-6 md:p-8 rounded-xl hover:translate-y-[-8px] transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-primary">dashboard</span>
                            </div>
                            <h3 className="font-headline-md text-headline-md mb-3 text-lg">Your Private File Vault</h3>
                            <p className="font-body-sm text-body-sm text-slate-gray">Never lose your generated ideas. Access your private dashboard to easily see, copy, and reuse any past generated content.</p>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="bg-surface-container-lowest py-16 md:py-24 border-y border-border-subtle" id="how-it-works">
                    <div className="max-w-container-max mx-auto px-6 lg:px-margin-lg">
                        <div className="text-center mb-12 md:mb-16">
                            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-4">Three Steps to Virality</h2>
                            <p className="font-body-md text-body-md text-slate-gray">Our workflow is designed for maximum speed without sacrificing quality.</p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
                            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 -translate-y-12 z-0"></div>
                            <div className="relative z-10 text-center">
                                <div className="w-16 h-16 rounded-full bg-background border-2 border-primary flex items-center justify-center mx-auto mb-6 text-headline-md font-bold text-primary shadow-[0_0_20px_rgba(192,193,255,0.3)]">1</div>
                                <h4 className="font-headline-md text-headline-md mb-4">Drop Your File</h4>
                                <p className="font-body-md text-body-md text-slate-gray">Upload your finished media file and let our AI handle the analysis automatically.</p>
                            </div>
                            <div className="relative z-10 text-center">
                                <div className="w-16 h-16 rounded-full bg-background border-2 border-primary flex items-center justify-center mx-auto mb-6 text-headline-md font-bold text-primary shadow-[0_0_20px_rgba(192,193,255,0.3)]">2</div>
                                <h4 className="font-headline-md text-headline-md mb-4">Optimize Content</h4>
                                <p className="font-body-md text-body-md text-slate-gray">Review  customized titles, summary, description, timestamps, captions, hashtags and thumbnail generated based on your video's specific context.</p>
                            </div>
                            <div className="relative z-10 text-center">
                                <div className="w-16 h-16 rounded-full bg-background border-2 border-primary flex items-center justify-center mx-auto mb-6 text-headline-md font-bold text-primary shadow-[0_0_20px_rgba(192,193,255,0.3)]">3</div>
                                <h4 className="font-headline-md text-headline-md mb-4">Copy &amp; Post</h4>
                                <p className="font-body-md text-body-md text-slate-gray">Pick from multiple high-converting options and boost your reach on any platform immediately.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="max-w-container-max mx-auto px-6 lg:px-margin-lg py-20 md:py-32 text-center">
                    <div className="glass-card p-8 md:p-20 rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/20 blur-[100px] rounded-full"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full"></div>
                        <h2 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl mb-6 relative z-10">Start Boosting Your Content Today</h2>
                        <p className="font-body-lg text-body-md md:text-body-lg text-slate-gray mb-10 max-w-xl mx-auto relative z-10">
                            Join over 5,000+ creators who are saving 10+ hours a week on content distribution and SEO.
                        </p>
                        <div className="relative z-10">
                            <Link to="/register" className="bg-primary text-on-primary font-headline-md text-lg md:text-headline-md px-10 md:px-12 py-4 md:py-5 rounded-xl glow-button hover:scale-105 active:scale-95 transition-all duration-200 w-full sm:w-auto inline-block">
                                Sign Up Now — It's Free
                            </Link>
                            <p className="text-label-sm font-label-sm text-slate-gray mt-6 uppercase tracking-widest">No credit card required</p>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-surface-container-lowest border-t border-border-subtle">
                <div className="flex flex-col md:flex-row justify-between items-center px-6 lg:px-margin-lg py-margin-md max-w-container-max mx-auto">
                    <div className="mb-8 md:mb-0 text-center md:text-left">
                        <div className="font-headline-md text-headline-md font-bold text-on-surface flex items-center justify-center md:justify-start gap-2">
                            <span className="hidden sm:inline font-bold">CreatorBoost.ai</span>
                        </div>
                        <p className="font-body-sm text-body-sm text-slate-gray mt-1">© 2026 CreatorBoost.ai. All rights reserved.</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                        <a href="#" className="font-body-sm text-body-sm text-slate-gray hover:text-secondary transition-colors opacity-80 hover:opacity-100">Privacy Policy</a>
                        <a href="#" className="font-body-sm text-body-sm text-slate-gray hover:text-secondary transition-colors opacity-80 hover:opacity-100">Terms of Service</a>
                        <a href="#" className="font-body-sm text-body-sm text-slate-gray hover:text-secondary transition-colors opacity-80 hover:opacity-100">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
