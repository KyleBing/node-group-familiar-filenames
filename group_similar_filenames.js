/**
 * 所选目录下所有相似文件名分组显示
 */

const fs = require("node:fs")
const path = require("node:path")

const targetFolder = 'C:\\Program Files'

let amount = 0

fs.readdir(
    targetFolder,
    {
        withFileTypes: false,
        recursive: false
    },
    (err, files) => {
        getSimilarFiles(files)
    })

function getSimilarFiles(files) {
    amount = files.length
    let similarFileArray = []

    let sortedPureFileNames = files.map(file => {
        return path.basename(file, path.extname(file))  // 获取到纯文件名，without 后缀名
    })
        .sort((a, b) => a.length > b.length ? -1 : 0)

    for (let i = 0; i < sortedPureFileNames.length; i++) {
        const outName = sortedPureFileNames[i]
        let currentArray = [outName]
        for (let j = i + 1; j < sortedPureFileNames.length; j++) {
            let innerName = sortedPureFileNames[j]

            if (isFileSimilar(outName,innerName)) {
                // console.log(outName, innerName, j, '✓')
                currentArray.push(innerName)
                sortedPureFileNames.splice(j, 1)
                j--
            } else {
                // console.log(outName, innerName, j)
            }
        }
        similarFileArray.push(currentArray)
    }

    similarFileArray.sort((a, b) => a.length > b.length ? -1 : 1)

    printFormat(similarFileArray)

}

function isFileSimilar(a,b){
    // RULE 1: 除去数字之后，剩余部分相同
    let aAfterReplace = a.replace(/\d/g, '')
    let bAfterReplace = b.replace(/\d/g, '')

    let similarWithoutDigit = aAfterReplace === bAfterReplace


    // RULE 2: 前一个单词相同：空格
    let aFirstWordSpace = a.substring(0, a.indexOf(' '))
    let bFirstWordSpace = b.substring(0, b.indexOf(' '))

    let similarWithFirstWord = aFirstWordSpace !== '' && aFirstWordSpace === bFirstWordSpace


    // RULE 3: 前一个单词相同：_
    let aFirstWord_ = a.substring(0, a.indexOf('_'))
    let bFirstWord_ = b.substring(0, b.indexOf('_'))

    let similarWithFirstWord_ = aFirstWord_ !== '' && aFirstWord_ === bFirstWord_


    // RULE 4: 前一个单词相同：__
    let aFirstWord__ = a.substring(0, a.indexOf('-'))
    let bFirstWord__ = b.substring(0, b.indexOf('-'))

    let similarWithFirstWord__ = aFirstWord__ !== '' && aFirstWord__ === bFirstWord__


    return similarWithoutDigit ||
        similarWithFirstWord ||
        similarWithFirstWord_ ||
        similarWithFirstWord__
}


function printFormat(nameGroups){

    console.log('-----------------------------------')
    console.log(`     TOTAL: ${amount}`)
    console.log(`     GROUP: ${nameGroups.length}`)
    console.log('-----------------------------------')
    nameGroups.forEach((nameArray, index) => {
        console.log(
            String(index + 1),
            `(${nameArray.length})`,
        )
        nameArray.forEach(name => {
            console.log('\t\t',name)
        })
    })
}
