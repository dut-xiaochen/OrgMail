#!/bin/sh

base_dir=/home/DreamArts/insuite
comp_jar=/usr/lib/dojo/shrinksafe.jar
build_dir=./build

mkdir ${build_dir}

js_files="${base_dir}/js/jquery/ui/jquery-ui.js \
  ${base_dir}/js/iui/iui.js \
  ${base_dir}/js/SmartPhone/bottomUp.js \
  ${base_dir}/js/SmartPhone/touchMenu.js \
  ${base_dir}/js/SmartPhone/mail.js \
  ${base_dir}/js/SmartPhone/schedule.js \
  ${base_dir}/js/SmartPhone/address.js \
  ${base_dir}/js/SmartPhone/selectDialog.js \
  ${base_dir}/js/SmartPhone/portal.js \
  ${base_dir}/js/SmartPhone/nsboard.js \
  ${base_dir}/js/SmartPhone/notice.js \
  ${base_dir}/js/SmartPhone/report.js \
  ${base_dir}/js/SmartPhone/config.js \
  ${base_dir}/js/SmartPhone/workflow.js \
  ${base_dir}/js/SmartPhone/libraryFolder.js \
  ${base_dir}/js/SmartPhone/libraryList.js \
  ${base_dir}/js/SmartPhone/libraryFile.js \
  ${base_dir}/js/SmartPhone/storage.js"

cat ${js_files} > ${build_dir}/all.js
java -jar ${comp_jar} ${build_dir}/all.js > ${build_dir}/all-comp.js
cp ${build_dir}/all-comp.js  ${base_dir}/js/SmartPhone/all-comp.js

rm -rf  ${build_dir}

