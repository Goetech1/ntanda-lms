"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const global_exception_filter_1 = require("./common/filters/global-exception.filter");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const common_1 = require("@nestjs/common");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { rawBody: true });
    app.setGlobalPrefix('api/v1');
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    });
    app.useWebSocketAdapter(new platform_socket_io_1.IoAdapter(app));
    app.use(cookieParser());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    await app.listen(process.env.PORT || 8000);
    console.log(`🚀 Ntanda LMS API running on: http://localhost:${process.env.PORT || 8000}/api/v1`);
    console.log(`🔌 WebSocket namespace: ws://localhost:${process.env.PORT || 8000}/notifications`);
}
bootstrap();
//# sourceMappingURL=main.js.map