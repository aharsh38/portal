var getParamRegistration = function (Registration) {
    return function(request, response, next){
        console.log(request.params.teamId);
        Registration.find({
          teamId: request.params.teamId
        })
            .exec(function (error, registration) {
                if(error){
                    response.json(error);
                }
                else if(registration){

                    request.registration = registration;
                    next();
                }
                else{
                    response.status(404).send({
                        'message' : 'Registration Data not found'
                    });
                }
            });
    };
};
module.exports = getParamRegistration;
