export const successResponse = (message ,data = null , status = 200)=>{
    return Response.json(
        {
            success : true ,
            message ,
            data ,
        },
        { status }
    );
};

export const errorResponse = (message , status = 500 , error = null )=>{
    return Response.json(
        {
            success : false ,
            message ,
            error ,
        },
        {status}

    );
};