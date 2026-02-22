export default function MetasoundPrivacy() {
    return (
        <div className="flex flex-col items-center pt-12 pb-24 text-white selection:bg-white/20">
            <div className="w-full max-w-3xl mx-auto px-4">

                {/* Header */}
                <div className="mb-12">
                    <div className="inline-block px-3 py-1 mb-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                        Legal
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Metasound Privacy Policy
                    </h1>
                    <p className="text-neutral-400 text-lg">
                        Last updated: February 2026
                    </p>
                </div>

                {/* Content */}
                <div className="prose prose-invert prose-neutral max-w-none text-neutral-300">
                    <p className="lead text-lg text-neutral-200 mb-8">
                        Gaston Ibarroule (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the Metasound iOS application (the &quot;App&quot;). We respect your privacy and are committed to protecting it through our compliance with this policy. Metasound is designed with privacy at its core, ensuring your audio recordings and metadata remain absolutely in your control.
                    </p>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Data Collection and Usage</h2>

                        <div className="space-y-6">
                            <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
                                    Audio Recordings
                                </h3>
                                <p className="m-0 text-sm">All audio recordings made using the App are stored entirely on your local device. We do not transmit, collect, or store your audio recordings on our servers.</p>
                            </div>

                            <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><path d="M2 12h4l3-9 5 18 3-9h5"></path></svg>
                                    Speech-to-Text (Voice Slate)
                                </h3>
                                <p className="m-0 text-sm">The Voice Slate feature uses on-device machine learning (Apple&apos;s WhisperKit) to transcribe your voice for file naming. No voice data or transcriptions are ever sent to the cloud or third-party servers.</p>
                            </div>

                            <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                    Location Data
                                </h3>
                                <p className="m-0 text-sm">If you grant the App permission to access your location, this data is used exclusively to tag your recordings with geographical metadata (reverse geocoding). This location data is saved locally within the file metadata on your device and is not collected by us.</p>
                            </div>

                            <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>
                                    Cloud Sync
                                </h3>
                                <p className="m-0 text-sm">You may choose to back up your data using third-party services like iCloud Drive, Google Drive, or Dropbox. When you use these services, your data is governed by the privacy policies of those respective providers. We do not have access to your cloud accounts or backups.</p>
                            </div>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4 border-b border-white/10 pb-2">2. Analytics and Third-Party Tracking</h2>
                        <p>
                            The App does not include any third-party analytics trackers, advertising SDKs, or behavioral tracking tools. We do not collect personal data for marketing purposes.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4 border-b border-white/10 pb-2">3. Data Retention</h2>
                        <p>
                            Because the App operates primarily offline and stores data locally, we do not dictate data retention. You maintain full control over your files and can delete them from your device or your chosen cloud storage at any time.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-white mb-4 border-b border-white/10 pb-2">4. Changes to This Privacy Policy</h2>
                        <p>
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. Changes will be incorporated with your next app version update.
                        </p>
                    </section>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                        <h2 className="text-xl font-semibold text-white mb-3">Contact Us</h2>
                        <p className="text-neutral-400 mb-6">
                            If you have any questions about this Privacy Policy, please reach out to us.
                        </p>
                        <a
                            href="mailto:metasound.info@gmail.com"
                            className="inline-block bg-white text-black px-8 py-3 rounded-full font-semibold transition-transform hover:-translate-y-0.5 hover:shadow-lg"
                        >
                            metasound.info@gmail.com
                        </a>
                    </div>

                </div>
            </div>
        </div>
    );
}
