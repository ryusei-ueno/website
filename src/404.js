(function () {
            function $id(id) { return document.getElementById(id); }
            try {
                var path = window.location.pathname + window.location.search + window.location.hash;
                var ref = document.referrer || "—";
                var ua  = (navigator.userAgent || "—").replace(/\s+/g, " ").trim();
                var now = new Date();
                var iso = now.toISOString();

                var $path = $id("nf-path"), $ref = $id("nf-referrer"),
                    $ua = $id("nf-ua"), $ts = $id("nf-ts");

                if ($path) $path.textContent = path;
                if ($ref)  $ref.textContent  = ref;
                if ($ua)   $ua.textContent   = ua;
                if ($ts) { $ts.textContent = iso; $ts.setAttribute("datetime", iso); }

                // Make the tab title explicit in history/search results.
                if (document && document.title && document.title.indexOf("404") === -1) {
                    document.title = "404 – " + document.title;
                }
            } catch (e) { /* fail silently */ }
        })();