const {parse} = require("./index");

(async function () {
    const tf_file_content = `resource "null_resourse" "test" { }
resource "null_resourse" "test2" {}
resource "terraform_data" "test3" {}
`
    console.log(await parse('main.tf', tf_file_content));
})();

