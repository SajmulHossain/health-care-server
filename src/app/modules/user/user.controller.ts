import catchAsync from "../../shared/catchAsync";

const createPatient = catchAsync(async(req, res) => {
    console.log(req.body);
    res.send('aice')
})

export const UserControllers = {
    createPatient
}