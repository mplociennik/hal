<?php

namespace AppBundle\Utils;

use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class JsonFromDbObjectConverter
{
	/**
	 * @param object|array $object
	 * @return string json
	 */
	public function convertObjectToJson($object)
	{
		$encoder = new JsonEncoder();

		$normalizer = new ObjectNormalizer();
		$normalizer->setIgnoredAttributes(['__initializer__', '__cloner__', '__isInitialized__']);
		$normalizer->setCircularReferenceHandler(function ($object) {
			return $object->getId();
		});
		$serializer = new Serializer([$normalizer], [$encoder]);

		return $serializer->serialize($object, 'json');
	}
}