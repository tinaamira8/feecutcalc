# FeeMargin

Independent client-side fee and profit calculators built with Vite, React, TypeScript and Tailwind CSS. All calculations run in the browser. No login, API keys, remote fonts, analytics or ad scripts are required.

## Run

```sh
npm install
npm run dev
```

## Validate and publish

```sh
npm run check
npm test
npm run build
npm run audit:build
npm run preview
```

Upload `dist/` to a static host supporting directory index files. The build writes 200 complete HTML routes (192 guides and eight core pages), a 404 page, sitemap and robots file. Do not rewrite missing pages to the homepage; serve `404.html` with HTTP status 404. Netlify and Cloudflare Pages support the included `_headers`; configure equivalent headers on other hosts.

`npm run generate:seo` deterministically updates the committed scenario dataset and, if a dist build exists, prerenders the app. `prebuild` regenerates the dataset before Vite bundles it, preventing stale client content. Static generation uses the same React components and fee engine as the browser. It does not depend on external prerendering services.

## Files

- `src/data/fees.ts`: centralized fee presets, sources, cent rounding, reverse solver and profit engine.
- `src/components/site/seo.tsx`: site name, canonical origin and metadata renderer; shared by Vite sitemap and prerendering.
- `scripts/generate-seo-pages.mjs`: deterministic editorial scenarios, FAQ and related links, full HTML generation.
- `src/App.tsx`: calculators, interactive homepage, searchable library, methodology and legal pages.
- `scripts/math.test.ts`: arithmetic, reverse minimality and content integrity tests.

## Before public launch

The production domain is `https://feecutcalc.com`, supplied by the publisher. It is configured in `seo.tsx` and used for canonical URLs, the sitemap and robots.txt. The contact page publishes contact@feecutcalc.com. Email routing and delivery must be verified separately. The operator should ensure the legal pages identify the appropriate publishing entity. Review policies for the actual host, retention practices and jurisdiction.

Only Stripe US domestic rates, Etsy transaction / US processing and Upwork's variable contract range were checked against official sources during this implementation. Other defaults are labeled illustrative assumptions, including negotiated Toptal payouts and variable Wise routes. Verify every preset against the intended country, account plan and payment product before presenting them as current rates. Adjust schedules in `fees.ts`; regenerated content will use the new formulas.

No implementation can guarantee indexing or Google AdSense approval. The app loads the AdSense publisher script and publishes the matching ads.txt record for pub-1781335642360761. Manual banners require a real ad-unit slot ID. Before enabling ads, add a compliant consent management platform wherever required and update the privacy policy for actual data processing. Ads must remain below calculator controls. Generated scenario prose is 190–230 words plus FAQs, but editorial review is still appropriate before indexing a large programmatic library.

## Model boundaries

USD, US-oriented per-transaction assumptions. FX is applied to gross. Fees round individually to cents; reverse mode searches for the smallest invoice cent covering a target. Marketplace fees apply to item price plus buyer shipping. COGS and actual fulfillment remain separate. Subscription allocation, Amazon fulfillment, category variations, taxes and promotional fees require user inputs. Third-party Shopify processing is editable in addition to Shopify's assumed gateway surcharge. Etsy ad caps are not automated. Break-even is a pre-rounding continuous price, while fee breakdowns round to cents.

New quote links preserve inputs in URL fragments; old query-based links are migrated after their initial request. Links can enter browser history, and third-party page scripts can access the URL. CSV exports happen locally. Theme preference is stored locally. Do not enter confidential identifiers.

## Trust pages and quote privacy

Dedicated pages in `src/pages/` provide the 192-guide directory, methodology, contact composer, privacy policy and terms. The site uses the FeeMargin brand at https://feecutcalc.com, with contact@feecutcalc.com as its published contact address. Terms select Victoria, Australia. Verify mailbox delivery separately before relying on enquiries.

Calculator quote state uses URL fragments, which are not included in HTTP requests. Legacy query links migrate in-browser after their initial request. `npm test` includes round-trip and migration coverage. The contact composer opens an email client and never sends automatically. The shared HTML head loads the Google AdSense script for ca-pub-1781335642360761 on all generated pages. Consent configuration and publisher approval remain separate requirements in AdSense.

### Calculator banner placement

`CalculatorAd` renders immediately below the calculator inputs/results and above the freelance comparison table on both calculator routes and all generated scenario pages. Set `VITE_ADSENSE_CALCULATOR_SLOT` to the real numeric `data-ad-slot` from an AdSense display ad unit, then rebuild/redeploy. An empty value renders no banner and queues no banner request. The publisher ID is already configured in `AdBanner`; an ad-unit slot ID is a separate value.

## Release checks and hosting headers

`npm run release` requires TypeScript, calculation/quote tests, the production build and the 200-route static audit to pass. Vercel uses this command before deployment; GitHub Actions runs the same checks for main pushes and pull requests. `vercel.json` supplies nosniff, same-origin framing and strict-origin-when-cross-origin referrer headers. The `_headers` file remains for other static hosts.
