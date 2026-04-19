import type {
  NewsletterIssue,
  NewsletterDevelopment,
  NewsletterToolWatch,
  NewsletterRadarSignal,
  NewsletterPick,
} from '@/types'

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatIssueDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const months = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
  ]
  return `${day}. ${months[month - 1]} ${year}`
}

function resolveEditorsNote(issue: NewsletterIssue): string {
  return issue.editorsNoteMode === 'manual' && issue.editorsNoteManual
    ? issue.editorsNoteManual
    : issue.editorsNoteAuto
}

// ─── Section renderers ────────────────────────────────────────────────────────

function renderDivider(): string {
  return `
    <tr>
      <td style="background-color: #FFFFFF; padding: 0 48px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr><td style="height: 1px; background-color: #F3F4F6; font-size: 0; line-height: 0;">&nbsp;</td></tr>
        </table>
      </td>
    </tr>`
}

function renderStrongDivider(): string {
  return `
    <tr>
      <td style="background-color: #FFFFFF; padding: 0 48px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr><td style="height: 1px; background-color: #E5E7EB; font-size: 0; line-height: 0;">&nbsp;</td></tr>
        </table>
      </td>
    </tr>`
}

function renderDevelopments(items: NewsletterDevelopment[]): string {
  const rows = items
    .map(
      (item, i) => `
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
               style="margin-bottom: ${i < items.length - 1 ? '24px' : '0'};">
          <tr>
            <td valign="top" width="28" style="padding-top: 2px;">
              <span style="font-size: 10px; font-weight: 700; color: #D1D5DB;
                           font-family: Arial, Helvetica, sans-serif; letter-spacing: 0.08em;">
                ${String(i + 1).padStart(2, '0')}
              </span>
            </td>
            <td valign="top">
              ${
                item.sourceUrl
                  ? `<a href="${esc(item.sourceUrl)}" style="font-size: 15px; font-weight: 700; color: #111827;
                       font-family: Georgia, 'Times New Roman', serif; text-decoration: none;
                       line-height: 1.4; display: block; margin-bottom: 6px;">${esc(item.title)}</a>`
                  : `<p style="margin: 0 0 6px; font-size: 15px; font-weight: 700; color: #111827;
                       font-family: Georgia, 'Times New Roman', serif; line-height: 1.4;">${esc(item.title)}</p>`
              }
              <p style="margin: 0; font-size: 13px; line-height: 1.7; color: #6B7280;
                         font-family: Arial, Helvetica, sans-serif;">${esc(item.summary)}</p>
            </td>
          </tr>
        </table>`
    )
    .join('')

  return `
    <tr>
      <td style="background-color: #FFFFFF; padding: 28px 48px;">
        <p style="margin: 0 0 20px; font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase;
                   color: #9CA3AF; font-family: Arial, Helvetica, sans-serif; font-weight: 700;">Entwicklungen</p>
        ${rows}
      </td>
    </tr>`
}

function renderToolWatch(tool: NewsletterToolWatch): string {
  const toolUrl = `https://www.lex-lab.de/tools/${esc(tool.toolSlug)}`
  return `
    <tr>
      <td style="background-color: #FFFFFF; padding: 28px 48px;">
        <p style="margin: 0 0 16px; font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase;
                   color: #9CA3AF; font-family: Arial, Helvetica, sans-serif; font-weight: 700;">Tool Watch</p>
        <p style="margin: 0 0 8px; font-size: 16px; font-weight: 700; color: #111827;
                   font-family: Georgia, 'Times New Roman', serif; line-height: 1.3;">${esc(tool.toolName)}</p>
        <p style="margin: 0 0 14px; font-size: 14px; line-height: 1.7; color: #374151;
                   font-family: Arial, Helvetica, sans-serif;">${esc(tool.why)}</p>
        <a href="${toolUrl}" style="font-size: 13px; font-weight: 600; color: #111827;
                  font-family: Arial, Helvetica, sans-serif; text-decoration: none;
                  border-bottom: 1px solid #D1D5DB; padding-bottom: 1px;">Tool ansehen →</a>
      </td>
    </tr>`
}

function renderRadarSignals(signals: NewsletterRadarSignal[]): string {
  const rows = signals
    .map(
      s => `
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 16px;">
          <tr>
            <td valign="top" width="18" style="padding-top: 3px; color: #9CA3AF; font-size: 11px;
                 font-family: Arial, Helvetica, sans-serif;">◆</td>
            <td valign="top">
              <p style="margin: 0 0 3px; font-size: 14px; font-weight: 600; color: #111827;
                         font-family: Arial, Helvetica, sans-serif;">${esc(s.title)}</p>
              <p style="margin: 0; font-size: 13px; line-height: 1.65; color: #6B7280;
                         font-family: Arial, Helvetica, sans-serif;">${esc(s.context)}</p>
            </td>
          </tr>
        </table>`
    )
    .join('')

  return `
    <tr>
      <td style="background-color: #FFFFFF; padding: 28px 48px;">
        <p style="margin: 0 0 20px; font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase;
                   color: #9CA3AF; font-family: Arial, Helvetica, sans-serif; font-weight: 700;">Marktbeobachtung</p>
        ${rows}
      </td>
    </tr>`
}

function renderPick(pick: NewsletterPick): string {
  const pickUrl = `https://www.lex-lab.de/${pick.type === 'tool' ? 'tools' : 'prompts'}/${esc(pick.slug)}`
  return `
    <tr>
      <td style="background-color: #FFFFFF; padding: 28px 48px 32px;">
        <p style="margin: 0 0 14px; font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase;
                   color: #9CA3AF; font-family: Arial, Helvetica, sans-serif; font-weight: 700;">LexLab Pick</p>
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td style="background-color: #F9FAFB; border: 1px solid #E5E7EB; padding: 20px 24px;">
              <p style="margin: 0 0 6px; font-size: 16px; font-weight: 700; color: #111827;
                         font-family: Georgia, 'Times New Roman', serif;">${esc(pick.name)}</p>
              <p style="margin: 0 0 14px; font-size: 14px; line-height: 1.7; color: #374151;
                         font-family: Arial, Helvetica, sans-serif;">${esc(pick.why)}</p>
              <a href="${pickUrl}" style="font-size: 13px; font-weight: 600; color: #111827;
                        font-family: Arial, Helvetica, sans-serif; text-decoration: none;
                        border-bottom: 1px solid #D1D5DB; padding-bottom: 1px;">Jetzt ansehen →</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function buildNewsletterHtml(issue: NewsletterIssue, unsubscribeUrl: string): string {
  const editorsNote = resolveEditorsNote(issue)
  const displayDate = formatIssueDate(issue.issueDate)

  return `<!DOCTYPE html>
<html lang="de" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${esc(issue.title)}</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    @media only screen and (max-width: 620px) {
      .outer { width: 100% !important; }
      .inner-pad { padding-left: 24px !important; padding-right: 24px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F7F5;
             -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">

  <!-- Preheader (hidden preview text) -->
  <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all; color: #F7F7F5;">
    ${esc(issue.preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
         style="background-color: #F7F7F5;">
    <tr>
      <td align="center" style="padding: 40px 16px 48px;">

        <table class="outer" width="600" cellpadding="0" cellspacing="0" role="presentation"
               style="max-width: 600px; width: 100%;">

          <!-- ─── Header ─────────────────────────────────────────── -->
          <tr>
            <td class="inner-pad" style="background-color: #FFFFFF; padding: 36px 48px 28px;
                 border-bottom: 1px solid #F3F4F6;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td>
                    <p style="margin: 0 0 2px; font-size: 9px; letter-spacing: 0.18em;
                               text-transform: uppercase; color: #9CA3AF;
                               font-family: Arial, Helvetica, sans-serif; font-weight: 700;">LexLab</p>
                    <h1 style="margin: 0; font-size: 26px; font-weight: 700; color: #111827;
                                font-family: Georgia, 'Times New Roman', serif;
                                letter-spacing: -0.02em; line-height: 1.2;">Weekly Brief</h1>
                  </td>
                  <td align="right" valign="bottom">
                    <p style="margin: 0; font-size: 12px; color: #9CA3AF;
                               font-family: Arial, Helvetica, sans-serif;">${displayDate}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ─── Editor's Note ──────────────────────────────────── -->
          <tr>
            <td class="inner-pad" style="background-color: #FFFFFF; padding: 32px 48px 28px;">
              <p style="margin: 0 0 10px; font-size: 9px; letter-spacing: 0.15em;
                         text-transform: uppercase; color: #9CA3AF;
                         font-family: Arial, Helvetica, sans-serif; font-weight: 700;">Einschätzung</p>
              <p style="margin: 0; font-size: 15px; line-height: 1.8; color: #374151;
                         font-family: Georgia, 'Times New Roman', serif;
                         font-style: italic;">${esc(editorsNote)}</p>
            </td>
          </tr>

          ${renderDivider()}
          ${renderDevelopments(issue.topDevelopments)}

          ${issue.toolWatch ? `${renderDivider()}${renderToolWatch(issue.toolWatch)}` : ''}

          ${issue.radarSignals.length > 0 ? `${renderDivider()}${renderRadarSignals(issue.radarSignals)}` : ''}

          ${issue.lexlabPick ? `${renderStrongDivider()}${renderPick(issue.lexlabPick)}` : ''}

          <!-- ─── Footer ────────────────────────────────────────── -->
          ${renderStrongDivider()}
          <tr>
            <td class="inner-pad" style="background-color: #FFFFFF; padding: 28px 48px 40px;">
              <p style="margin: 0 0 16px;">
                <a href="https://www.lex-lab.de" style="font-size: 14px; font-weight: 600;
                          color: #111827; font-family: Arial, Helvetica, sans-serif;
                          text-decoration: none;">lex-lab.de →</a>
              </p>
              <p style="margin: 0; font-size: 12px; color: #9CA3AF;
                         font-family: Arial, Helvetica, sans-serif; line-height: 1.7;">
                LexLab · KI-Tools für den deutschen Rechtsmarkt<br>
                Kein Rechtsrat. Keine Steuerberatung.<br>
                <a href="${unsubscribeUrl}" style="color: #9CA3AF; text-decoration: underline;">Abmelden</a>
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`
}
