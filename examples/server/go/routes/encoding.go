package routes

import (
    "bytes"
    "encoding/json"
    "encoding/xml"
    "fmt"
    "log"
)

// An Encoder implements an encoding format of values to be sent as response to
// requests on the API endpoints.
type Encoder interface {
    EncodeOne(v interface{}) (string, error)
    Encode(v ...interface{}) (string, error)
}

// Because `panic`s are caught by martini's Recovery handler, it can be used
// to return server-side errors (500). Some helpful text message should probably
// be sent, although not the technical error (which is printed in the log).
func Must(data string, err error) string {
    if err != nil {
        panic(err)
    }
    return data
}

type JsonEncoder struct{}

// JsonEncoder is an Encoder that produces JSON-formatted responses.
func (_ JsonEncoder) EncodeOne(v interface{}) (string, error) {
    var data interface{} = v
    b, err := json.Marshal(data)
    return string(b), err
}

func (_ JsonEncoder) Encode(v ...interface{}) (string, error) {
    var data interface{} = v
    if v == nil {
        // So that empty results produces `[]` and not `null`
        data = []interface{}{}
    }
    b, err := json.Marshal(data)
    return string(b), err
}

type XmlEncoder struct{}

// XmlEncoder is an Encoder that produces XML-formatted responses.
func (e XmlEncoder) EncodeOne(v interface{}) (string, error) {
    return e.Encode(v)
}

func (_ XmlEncoder) Encode(v ...interface{}) (string, error) {
    var buf bytes.Buffer
    if _, err := buf.Write([]byte(xml.Header)); err != nil {
        return "", err
    }
    if _, err := buf.Write([]byte("<result>")); err != nil {
        return "", err
    }
    b, err := xml.Marshal(v)
    if err != nil {
        return "", err
    }
    if _, err := buf.Write(b); err != nil {
        return "", err
    }
    if _, err := buf.Write([]byte("</result>")); err != nil {
        return "", err
    }
    return buf.String(), nil
}

type TextEncoder struct{}

// TextEncoder is an Encoder that produces plain text-formatted responses.
func (e TextEncoder) EncodeOne(v ...interface{}) (string, error) {
    return e.Encode(v)
}

func (_ TextEncoder) Encode(v ...interface{}) (string, error) {
    var buf bytes.Buffer
    for _, v := range v {
        if _, err := fmt.Fprintf(&buf, "%s\n", v); err != nil {
            return "", err
        }
    }
    return buf.String(), nil
}

func checkErr(err error, msg string) {
    if err != nil {
        log.Panicln(msg, err)
    }
}
