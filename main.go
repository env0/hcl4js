package main

import (
	"encoding/json"
	"github.com/hashicorp/hcl/v2"
	"github.com/hashicorp/hcl/v2/hclparse"
	"path/filepath"
	"strings"
	"syscall/js"
)

func resolve(value interface{}) js.Value {
	promiseConstructor := js.Global().Get("Promise")
	return promiseConstructor.New(js.FuncOf(func(this js.Value, args []js.Value) any {
		resolve := args[0]
		resolve.Invoke(value)
		return nil
	}))
}

func reject(value interface{}) js.Value {
	promiseConstructor := js.Global().Get("Promise")
	return promiseConstructor.New(js.FuncOf(func(this js.Value, args []js.Value) any {
		_, reject := args[0], args[1]
		reject.Invoke(value)
		return nil
	}))
}

func throwError(err string) js.Value {
	errorConstrictor := js.Global().Get("Error")
	return reject(errorConstrictor.New(err))
}

func parse(filename string, content string) js.Value {
	parser := hclparse.NewParser()
	suffix := strings.ToLower(filepath.Ext(filename))
	var file *hcl.File
	var diagnostics hcl.Diagnostics
	if suffix == ".json" {
		file, diagnostics = parser.ParseJSON([]byte(content), filename)
	} else {
		file, diagnostics = parser.ParseHCL([]byte(content), filename)
	}

	if diagnostics.HasErrors() {
		return throwError(diagnostics.Error())
	}

	res, _ := json.Marshal(file)

	return resolve(string(res))
}

func main() {
	js.Global().Get("console").Call("log", "HCL to JS loaded")

	// create a dictionary module
	module := make(map[string]interface{})
	module["parse"] = js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return parse(args[0].String(), args[1].String())
	})

	js.Global().Set("env0_hcl4js", module)

	// Keep the Go program running so that the `greet` function stays available
	select {}
}
