package com.eventhub.user.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    @Around("execution(* com.eventhub.user.controller.*.*(..))")
    public Object logControllerMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        Object[] args = joinPoint.getArgs();

        logger.info("Entering {}.{}() with arguments: {}", className, methodName, args);

        long startTime = System.currentTimeMillis();
        Object result;
        try {
            result = joinPoint.proceed();
            long endTime = System.currentTimeMillis();
            logger.info("Exiting {}.{}() with result: {}. Execution time: {}ms", 
                       className, methodName, result, endTime - startTime);
        } catch (Exception e) {
            logger.error("Exception in {}.{}(): {}", className, methodName, e.getMessage());
            throw e;
        }

        return result;
    }

    @Around("execution(* com.eventhub.user.service.*.*(..))")
    public Object logServiceMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();

        logger.debug("Service method {}.{}() called", className, methodName);

        long startTime = System.currentTimeMillis();
        Object result;
        try {
            result = joinPoint.proceed();
            long endTime = System.currentTimeMillis();
            logger.debug("Service method {}.{}() completed in {}ms", className, methodName, endTime - startTime);
        } catch (Exception e) {
            logger.error("Exception in service method {}.{}(): {}", className, methodName, e.getMessage());
            throw e;
        }

        return result;
    }
}
