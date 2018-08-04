

let errorHandler = (error) => {
    let errorMsg = {
        message: error,
        status: 0,
        error: error
    }
    return errorMsg
}

let pickResponse = (res, resStatus) => {
    let resMsg = {
        message: resStatus,
        status: 0,
        data: res
    }
    return resMsg
}


module.exports = {
    errorHandler,
    pickResponse
}