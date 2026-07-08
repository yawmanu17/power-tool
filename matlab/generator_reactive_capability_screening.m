function results = generator_reactive_capability_screening(data)
%GENERATOR_REACTIVE_CAPABILITY_SCREENING Screen generator net VAR delivery.
%
% This function is a cleaned MATLAB version of the Project 2 live script.
% It evaluates generator reactive power production and absorption across
% GSU tap settings using a two-bus generator/GSU/infinite-bus model.
%
% Required data fields:
%   MW_rated, Qmax, Qmin, V_Hi, V_Lo, PssL, QssL, perctX, Tap,
%   V_ConnectionkV
%
% Optional fields:
%   perctR, XoverR
%
% Values are converted to a 100 MVA study base when entered in MW/Mvar.

if nargin ~= 1 || ~isstruct(data)
    error('Provide one input argument: a data struct.');
end

requiredFields = {'MW_rated', 'Qmax', 'Qmin', 'V_Hi', 'V_Lo', ...
    'PssL', 'QssL', 'perctX', 'Tap', 'V_ConnectionkV'};
for index = 1:numel(requiredFields)
    fieldName = requiredFields{index};
    if ~isfield(data, fieldName)
        error('Missing required input field: %s', fieldName);
    end
end

[testVoltageProduction, testVoltageAbsorption] = scheduledVoltages(data.V_ConnectionkV);

tap = data.Tap(:).';
numberOfTaps = numel(tap);

pg = data.MW_rated / 100;
pssL = data.PssL / 100;
qssLScalar = data.QssL / 100;
qmax = data.Qmax / 100;
qmin = data.Qmin / 100;
x = data.perctX / 100;

if isfield(data, 'perctR')
    r = data.perctR / 100;
elseif isfield(data, 'XoverR') && data.XoverR ~= 0
    r = x / data.XoverR;
else
    error('Provide either perctR or XoverR so transformer resistance can be estimated.');
end

p1 = pg - pssL;
z = hypot(r, x);
phi = atan2d(r, x);

v1Production = ones(1, numberOfTaps) * data.V_Hi;
v2Production = testVoltageProduction ./ tap;
[v1Production, qgProduction, q2Production, p2Production] = solveOperatingMode( ...
    v1Production, v2Production, p1, qssLScalar, qmax, true, r, x, z, phi, data.V_Hi);

v1Absorption = ones(1, numberOfTaps) * data.V_Lo;
v2Absorption = testVoltageAbsorption ./ tap;
[v1Absorption, qgAbsorption, q2Absorption, p2Absorption] = solveOperatingMode( ...
    v1Absorption, v2Absorption, p1, qssLScalar, qmin, false, r, x, z, phi, data.V_Lo);

qssL = ones(numberOfTaps, 1) * qssLScalar;
qssH = zeros(numberOfTaps, 1);

results.production = table(tap(:), v1Production(:), qgProduction(:), qssL, qssH, ...
    q2Production(:), p2Production(:), ...
    'VariableNames', {'Tap', 'V1', 'Qg', 'QssL', 'QssH', 'Q2', 'P2'});

results.absorption = table(tap(:), v1Absorption(:), qgAbsorption(:), qssL, qssH, ...
    q2Absorption(:), p2Absorption(:), ...
    'VariableNames', {'Tap', 'V1', 'Qg', 'QssL', 'QssH', 'Q2', 'P2'});

results.assumptions = struct( ...
    'baseMVA', 100, ...
    'testVoltageProduction', testVoltageProduction, ...
    'testVoltageAbsorption', testVoltageAbsorption, ...
    'R', r, ...
    'X', x, ...
    'Z', z, ...
    'PhiDegrees', phi);
end

function [testVoltageProduction, testVoltageAbsorption] = scheduledVoltages(connectionKv)
switch connectionKv
    case 115
        testVoltageProduction = 1.00;
        testVoltageAbsorption = 1.03;
    case 230
        testVoltageProduction = 1.01;
        testVoltageAbsorption = 1.04;
    case 500
        testVoltageProduction = 1.02;
        testVoltageAbsorption = 1.05;
    otherwise
        error('Unsupported connection voltage. Use 115, 230, or 500 kV.');
end
end

function [v1, qg, q2, p2] = solveOperatingMode(v1, v2, p1, qssL, qLimit, isProduction, r, x, z, phi, voltageLimit)
delta = asind((z ./ (v1 .* v2)) .* (p1 - (v1.^2 ./ z) .* sind(phi))) + phi;
q1 = (v1.^2 ./ z) .* cosd(phi) - ((v1 .* v2) ./ z) .* cosd(delta - phi);
qg = q1 + qssL;

if isProduction
    limited = qg > qLimit;
else
    limited = qg < qLimit;
end

if any(limited)
    qg(limited) = qLimit;
    q1Limited = qLimit - qssL;
    e2 = ((p1 * x) - (q1Limited * r)) ./ v2(limited);
    discriminant = v2(limited).^2 - 4 * (e2.^2 - p1 * r - q1Limited * x);
    discriminant(discriminant < 0) = 0;
    e1 = (v2(limited) + sqrt(discriminant)) / 2;
    v1(limited) = sqrt(e1.^2 + e2.^2);

    notLimited = ~limited;
    v1(notLimited) = voltageLimit;
    delta(notLimited) = asind((z ./ (v1(notLimited) .* v2(notLimited))) .* ...
        (p1 - (v1(notLimited).^2 ./ z) .* sind(phi))) + phi;
end

iSquared = ((v1 .* cosd(delta) - v2).^2 + (v1 .* sind(delta)).^2) ./ (z.^2);
qLoss = iSquared * x;
pLoss = iSquared * r;
q2 = qg - qssL - qLoss;
p2 = p1 - pLoss;
end
