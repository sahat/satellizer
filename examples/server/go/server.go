package main

import (
    "./models"
    "./routes"
    //"log"
    "net/http"
    "regexp"
    "strings"
    "github.com/go-martini/martini"

	"github.com/coopernurse/gorp"
)

// The one and only martini instance.
var m *martini.Martini

func init() {
    m = martini.New()
    // Setup middleware
    m.Use(martini.Recovery())
    m.Use(martini.Logger())
    m.Use(martini.Static("../../client"))
    m.Use(MapEncoder)
    // Setup routes
    r := martini.NewRouter()
    
    // Inject database
    m.MapTo(models.Dbm, (*gorp.SqlExecutor)(nil))
    // Add the router action
    m.Action(r.Handle)
}

// The regex to check for the requested format (allows an optional trailing
// slash).
var rxExt = regexp.MustCompile(`(\.(?:xml|text|json))\/?$`)

// MapEncoder intercepts the request's URL, detects the requested format,
// and injects the correct encoder dependency for this request. It rewrites
// the URL to remove the format extension, so that routes can be defined
// without it.
func MapEncoder(c martini.Context, w http.ResponseWriter, r *http.Request) {
    // Get the format extension
    matches := rxExt.FindStringSubmatch(r.URL.Path)
    ft := ".json"
    if len(matches) > 1 {
        // Rewrite the URL without the format extension
        l := len(r.URL.Path) - len(matches[1])
        if strings.HasSuffix(r.URL.Path, "/") {
            l--
        }
        r.URL.Path = r.URL.Path[:l]
        ft = matches[1]
    }
    // Inject the requested encoder
    switch ft {
    case ".xml":
        c.MapTo(routes.XmlEncoder{}, (*routes.Encoder)(nil))
        w.Header().Set("Content-Type", "application/xml")
    case ".text":
        c.MapTo(routes.TextEncoder{}, (*routes.Encoder)(nil))
        w.Header().Set("Content-Type", "text/plain; charset=utf-8")
    default:
        c.MapTo(routes.JsonEncoder{}, (*routes.Encoder)(nil))
        w.Header().Set("Content-Type", "application/json")
    }
}

func main() {
    m.Run()
}
