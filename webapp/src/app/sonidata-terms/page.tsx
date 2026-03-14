import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sonidata — Terms of Use",
    description:
        "Terms of Use for Sonidata and Sonidata Embed applications by Gaston Ibarroule.",
};

export default function SonidataTerms() {
    const lastUpdated = "March 2026";
    const email = "sonidata.info@gmail.com";

    return (
        <div className="flex flex-col items-center pt-12 pb-24 text-white selection:bg-white/20">
            <div className="w-full max-w-3xl mx-auto px-4">

                {/* Header */}
                <div className="mb-12">
                    <div className="inline-block px-3 py-1 mb-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                        Legal
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Terms of Use
                    </h1>
                    <p className="text-neutral-400 text-lg">
                        Last updated: {lastUpdated}
                    </p>
                </div>

                {/* Content */}
                <div className="prose prose-invert prose-neutral max-w-none text-neutral-300">
                    <p className="lead text-lg text-neutral-200 mb-8">
                        These Terms of Use (&quot;Terms&quot;) govern your access to and use of the Sonidata iOS application and the Sonidata Embed desktop application (collectively, the &quot;Software&quot;), developed and published by Gaston Ibarroule (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). By downloading, installing, or using the Software, you agree to be bound by these Terms.
                    </p>

                    {/* 1. Acceptance of Terms */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4 border-b border-white/10 pb-2">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using the Software, you confirm that you have read, understood, and agree to be bound by these Terms and our <a href="/sonidata-privacy" className="underline text-white hover:text-neutral-300 transition-colors">Privacy Policy</a>. If you do not agree, you must discontinue use of the Software immediately.
                        </p>
                    </section>

                    {/* 2. Definitions */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4 border-b border-white/10 pb-2">2. Definitions</h2>
                        <div className="space-y-4">
                            <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-medium text-white mb-2">&quot;Sonidata&quot;</h3>
                                <p className="m-0 text-sm">The iOS application for professional field recording, metadata management, and audio capture.</p>
                            </div>
                            <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-medium text-white mb-2">&quot;Sonidata Embed&quot;</h3>
                                <p className="m-0 text-sm">The companion desktop application (macOS &amp; Windows) that embeds metadata from Sonidata into audio files using the BWF (Broadcast Wave Format) and iXML standards.</p>
                            </div>
                        </div>
                    </section>

                    {/* 3. License */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4 border-b border-white/10 pb-2">3. License</h2>
                        <p>
                            Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to download, install, and use the Software on devices you own or control, strictly for your personal or professional use.
                        </p>
                        <p className="mt-4">
                            Sonidata Embed requires a valid license key, obtained through an in-app purchase in Sonidata for iOS. Each license is for a single user and is non-transferable.
                        </p>
                    </section>

                    {/* 4. Restrictions */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4 border-b border-white/10 pb-2">4. Restrictions</h2>
                        <p className="mb-4">You agree not to:</p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-300">
                            <li>Copy, modify, distribute, sell, or lease any part of the Software.</li>
                            <li>Reverse-engineer, decompile, or disassemble the Software, except where applicable law expressly permits.</li>
                            <li>Attempt to circumvent any license verification, security mechanisms, or usage restrictions built into the Software.</li>
                            <li>Use the Software for any unlawful purpose or in violation of any applicable local, national, or international law.</li>
                            <li>Share, transfer, or sublicense your license key to any other person or entity.</li>
                        </ul>
                    </section>

                    {/* 5. Intellectual Property */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4 border-b border-white/10 pb-2">5. Intellectual Property</h2>
                        <p>
                            The Software and all associated content — including but not limited to its design, graphics, code, documentation, and trademarks — are and remain the exclusive property of Gaston Ibarroule. These Terms do not grant you any rights to our trademarks or branding.
                        </p>
                    </section>

                    {/* 6. User Content */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4 border-b border-white/10 pb-2">6. User Content &amp; Data</h2>
                        <p>
                            You retain full ownership of all audio recordings, metadata, and files created or processed through the Software. We do not claim any rights over your content. As described in our Privacy Policy, all user data is stored locally on your device and is never transmitted to our servers.
                        </p>
                    </section>

                    {/* 7. Purchases & Payments */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4 border-b border-white/10 pb-2">7. Purchases &amp; Payments</h2>
                        <p>
                            Sonidata Embed is available as a one-time in-app purchase through Sonidata for iOS, processed via Apple&apos;s App Store. All purchases are subject to Apple&apos;s terms and refund policies. We do not process payments directly.
                        </p>
                    </section>

                    {/* 8. Disclaimer of Warranties */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4 border-b border-white/10 pb-2">8. Disclaimer of Warranties</h2>
                        <p>
                            The Software is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis, without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Software will be uninterrupted, error-free, or free of harmful components.
                        </p>
                    </section>

                    {/* 9. Limitation of Liability */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4 border-b border-white/10 pb-2">9. Limitation of Liability</h2>
                        <p>
                            To the maximum extent permitted by applicable law, in no event shall Gaston Ibarroule be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of data, revenue, or profits, arising out of or related to your use of the Software — even if we have been advised of the possibility of such damages.
                        </p>
                    </section>

                    {/* 10. Indemnification */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4 border-b border-white/10 pb-2">10. Indemnification</h2>
                        <p>
                            You agree to indemnify and hold harmless Gaston Ibarroule from any claims, damages, liabilities, costs, and expenses (including reasonable legal fees) arising from your use of the Software or violation of these Terms.
                        </p>
                    </section>

                    {/* 11. Termination */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4 border-b border-white/10 pb-2">11. Termination</h2>
                        <p>
                            We reserve the right to suspend or terminate your access to the Software at any time, without prior notice, if you breach these Terms. Upon termination, your license to use the Software is immediately revoked, and you must delete all copies of the Software in your possession.
                        </p>
                    </section>

                    {/* 12. Changes to Terms */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4 border-b border-white/10 pb-2">12. Changes to These Terms</h2>
                        <p>
                            We may update these Terms from time to time. The updated version will be posted on this page with a revised &quot;Last updated&quot; date. Your continued use of the Software after any changes constitutes acceptance of the new Terms.
                        </p>
                    </section>

                    {/* 13. Governing Law */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-white mb-4 border-b border-white/10 pb-2">13. Governing Law</h2>
                        <p>
                            These Terms shall be governed by and construed in accordance with the laws of Germany, without regard to its conflict-of-law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in Berlin, Germany.
                        </p>
                    </section>

                    {/* Contact */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                        <h2 className="text-xl font-semibold text-white mb-3">Contact Us</h2>
                        <p className="text-neutral-400 mb-6">
                            If you have any questions about these Terms of Use, please reach out to us.
                        </p>
                        <a
                            href={`mailto:${email}`}
                            className="inline-block bg-white text-black px-8 py-3 rounded-full font-semibold transition-transform hover:-translate-y-0.5 hover:shadow-lg"
                        >
                            {email}
                        </a>
                    </div>

                </div>
            </div>
        </div>
    );
}
