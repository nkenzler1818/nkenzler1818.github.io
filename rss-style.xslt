<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="html" indent="yes" />

  <xsl:template match="/">
    <html>
      <head>
        <title><xsl:value-of select="rss/channel/title"/></title>
        <style>
          :root{
            --bg:#24242e;
            --panel:#2b2b36;
            --text:#e6e6eb;
            --muted:#9aa0b5;
            --border:#353543;

            --purple:#beafbd;   /* main accent */
            --blue:#7a86ad;     /* link accent */
            --orange:#f0502f;   /* string/description accent */
            --cyan:#beafbd;     /* label accent */
            --green:#9aa0b5;    /* comment/muted */
          }

          body{
            margin:0;
            background:var(--bg);
            color:var(--text);
            font-family:Consolas, "Fira Mono", "Courier New", monospace;
            line-height:1.55;
          }

          .wrap{
            max-width: 980px;
            margin: 0 auto;
            padding: 26px 28px 48px;
          }

          /* Top "editor" header */
          .topbar{
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:16px;
            padding: 14px 16px;
            background: var(--panel);
            border: 1px solid var(--border);
            border-radius: 10px;
            margin-bottom: 18px;
          }

          .feedtitle{
            font-size: 18px;
            color: var(--purple);
            font-weight: 700;
            letter-spacing: .2px;
          }

          .feedsublabel{
            font-size: 12px;
            color: var(--muted);
            margin-top: 2px;
          }

          .meta{
            font-size: 12px;
            color: var(--muted);
            text-align:right;
            white-space:nowrap;
          }

          .meta .k{ color: var(--cyan); }
          .meta .v{ color: var(--text); }

          /* List */
          .list{
            border: 1px solid var(--border);
            border-radius: 10px;
            overflow:hidden;
            background: rgba(0,0,0,0.10);
          }

          .item{
            padding: 16px 18px;
            border-top: 1px solid var(--border);
          }
          .item:first-child{ border-top:none; }

          .line{
            display:flex;
            gap:10px;
            align-items:flex-start;
          }

          .caret{
            color: var(--muted);
            width: 18px;
            flex: 0 0 18px;
          }

          .title{
            font-size: 15px;
            font-weight: 700;
            color: var(--purple);
          }

          .title a{
            color: var(--blue);
            text-decoration:none;
          }
          .title a:hover{ text-decoration: underline; }

          .row{
            margin-top: 8px;
            font-size: 12px;
            color: var(--muted);
          }
          .row .k{ color: var(--cyan); }
          .row .sep{ color: var(--muted); }
          .row .v{ color: var(--text); }

          .desc{
            margin-top: 10px;
            font-size: 13px;
            color: var(--orange);
          }

          .comment{
            margin-top: 14px;
            font-size: 12px;
            color: var(--green);
          }

          .pill{
            display:inline-block;
            margin-left: 10px;
            padding: 2px 8px;
            font-size: 11px;
            border-radius: 999px;
            border: 1px solid var(--border);
            color: var(--text);
            background: rgba(255,255,255,0.04);
          }

          .pill.blog{ color: var(--cyan); }
          .pill.projects{ color: var(--orange); }
        </style>
      </head>

      <body>
        <div class="wrap">
          <div class="topbar">
            <div>
              <div class="feedtitle">
                &lt;rss&gt; feed
                <span class="pill">
                  <xsl:value-of select="count(rss/channel/item)"/> items
                </span>
              </div>
              <div class="feedsublabel">
                <xsl:value-of select="rss/channel/description"/>
              </div>
            </div>

            <div class="meta">
              <div><span class="k">site</span><span class="sep">:</span> <span class="v"><xsl:value-of select="rss/channel/link"/></span></div>
              <div><span class="k">lastBuildDate</span><span class="sep">:</span> <span class="v"><xsl:value-of select="rss/channel/lastBuildDate"/></span></div>
            </div>
          </div>

          <div class="list">
            <xsl:for-each select="rss/channel/item">
              <div class="item">
                <div class="line">
                  <div class="caret">│</div>
                  <div>
                    <div class="title">
                      <a>
                        <xsl:attribute name="href">
                          <xsl:value-of select="link"/>
                        </xsl:attribute>
                        <xsl:value-of select="title"/>
                      </a>

                      <xsl:choose>
                        <xsl:when test="contains(category,'Blog')">
                          <span class="pill blog">Blog</span>
                        </xsl:when>
                        <xsl:when test="contains(category,'Project') or contains(category,'Projects')">
                          <span class="pill projects">Projects</span>
                        </xsl:when>
                        <xsl:otherwise>
                          <span class="pill">Update</span>
                        </xsl:otherwise>
                      </xsl:choose>
                    </div>

                    <div class="row">
                      <span class="k">pubDate</span><span class="sep">:</span>
                      <span class="v"><xsl:value-of select="pubDate"/></span>
                      <span class="sep"> • </span>
                      <span class="k">guid</span><span class="sep">:</span>
                      <span class="v"><xsl:value-of select="guid"/></span>
                    </div>

                    <div class="desc">
                      <xsl:value-of select="description"/>
                    </div>
                  </div>
                </div>
              </div>
            </xsl:for-each>
          </div>

          <div class="comment">
            <!-- Styled RSS preview (XSLT). RSS XML remains valid for readers. -->
          </div>
        </div>
      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>