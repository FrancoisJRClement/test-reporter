![Tests failed](https://img.shields.io/badge/tests-10%20passed%2C%202%20failed%2C%203%20skipped-critical)
## ❌ <a id="user-content-r0" href="#r0">fixtures/googletest-json.json</a>
**15** tests were completed in **14ms** with **10** passed, **2** failed and **3** skipped.
|Test suite|Passed|Failed|Skipped|Time|
|:---|---:|---:|---:|---:|
|[AllTests](#r0s0)|10✅|2❌|3⚪|14ms|
### ❌ <a id="user-content-r0s0" href="#r0s0">AllTests</a>
```
testClogRecord_simple
  ✅ default_constructors
  ✅ fatal
  ✅ critical
  ✅ warning
  ✅ notice
  ✅ progress
  ✅ debug
  ✅ extension
  ⚪ DISABLED_some_disabled
  ❌ some_failures
	../../../test/testClogRecord.cpp:342
testClogRecord_workingDir
  ✅ record_streaming
  ✅ extension_streaming
  ❌ other_failures
	../../../test/testClogRecord.cpp:356
DISABLED_testClogRecord_simple
  ⚪ skipped_failure
  ⚪ skipped_success
```